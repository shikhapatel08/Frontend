import { useRef, useState, useEffect } from "react";
import { AttachmentIcon, SendMsgIcon, EmojiIcon, TextFunctionallyIcon, GifIcon } from "../Common Components/Icon/Icon";
import { useDispatch, useSelector } from "react-redux";
import { addLocalMessage, SendMessage } from "../../Redux/Features/SendMessage";
import { useSocket } from "../../Context/SocketContext";
import { UpdateChat } from "../../Redux/Features/CreateChat";
import Picker from "emoji-picker-react";
import { shortenMessageText } from "../../Redux/Features/TextFunctionally";
import { useModal } from "../../Context/ModalContext";
import GlobalModal from "../Global Modal/GlobalModal";
import ShortenText from "../Modal/ShortenText";
import { FetchGif } from "../../Redux/Features/GifSlice";

export default function ChatInput({ text, fileInputRef, selectedChat, setText, setFilePreview, setFile, FilePreview, replyMsg, setReplyMsg, File, currentChat, JoinUser }) {
    const dispatch = useDispatch();
    const Signup = useSelector(state => state.signup.SignupUser);
    const Signin = useSelector(state => state.signin.SigninUser);
    const { canSendMessage } = useSelector(state => state.message);

    const { openModal, closeModal } = useModal();


    const user = Object.keys(Signin).length > 0 ? Signin : Signup;
    const socket = useSocket();

    const [showGifPicker, setShowGifPicker] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [gifSearch, setGifSearch] = useState('')
    const gifPickerRef = useRef(null);

    const textRef = useRef(null);
    const pickerRef = useRef(null);

    const { gifs, loading } = useSelector((state) => state.gif);

    const handleGifSearch = (e) => {
        setGifSearch(e.target.value);
        if (e.target.value.length > 1) {
            dispatch(FetchGif(e.target.value));
        }
    };

    const handleSendGif = (gifUrl) => {
        if (currentChat?.is_block) return;

        dispatch(addLocalMessage({
            chatId: selectedChat.id,
            text: "",
            image_url: FilePreview.map(p => p.url),
            gif_url: [gifUrl],
            sender_id: user.id,
            status: 'sending',
            pending: true,
            createdAt: new Date().toISOString(),
        }));

        const formData = new FormData();
        formData.append("chatId", selectedChat.id);
        if (text.trim()) {
            formData.append("text", text);
        }

        if (gifUrl) {
            formData.append("gif_url", gifUrl);
        }

        if (replyMsg) {
            formData.append("replyTo", replyMsg.id);
        }

        dispatch(SendMessage({ formData }));

        setReplyMsg(null);
        setShowGifPicker(false);
        setGifSearch("");
    };

    useEffect(() => {
        if (showGifPicker && gifSearch.length === 0) {
            dispatch(FetchGif("trending"));
        }
    }, [showGifPicker, dispatch]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (gifPickerRef.current && !gifPickerRef.current.contains(event.target)) {
                setShowGifPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const autoResize = () => {
        const el = textRef.current;
        if (!el) return;

        el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
    };

    const handleTypingInput = (e) => {
        if (currentChat?.is_block) return;
        setText(e.target.value);
        autoResize();

        if (!selectedChat?.id) return;
        const data = JSON.stringify({
            cid: selectedChat.id,
            uid: user.id,
            typing: true
        });
        socket?.emit("fe_typing", data);
    };


    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };


    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        const previews = files.map(file => ({
            url: URL.createObjectURL(file),
            type: file.type,
            name: file.name
        }));

        setFilePreview(prev => [...prev, ...previews]);
        setFile(prev => [...prev, ...files]);
    };

    const handleAttachClick = () => {
        fileInputRef.current?.click();
    };


    const removeFile = () => {
        setFile([]);
        setFilePreview([]);

        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    };

    const handlePaste = (e) => {
        const el = textRef.current;
        const items = e.clipboardData.items;

        let hasFile = false;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            if (item.type.startsWith("image") || item.kind === "file") {
                const file = item.getAsFile();
                if (!file) continue;

                hasFile = true;

                const previews = {
                    url: URL.createObjectURL(file),
                    type: file.type,
                    name: file.name
                };

                setFile(prev => [...prev, file]);
                setFilePreview(prev => [...prev, previews]);
            }
        }

        const content = e.clipboardData.getData("text/plain");
        if (content) {
            e.preventDefault();

            const start = el.selectionStart;
            const end = el.selectionEnd;
            const newText = text.substring(0, start) + content + text.substring(end);
            setText(newText);

            setTimeout(() => {
                el.selectionStart = el.selectionEnd = start + content.length;
                autoResize();
            }, 0);
        }

        if (hasFile) {
            e.preventDefault();
        }

        setTimeout(() => {
            autoResize();
        }, 0);
    };

    const handleDrop = (e) => {
        e.preventDefault();

        const files = Array.from(e.dataTransfer.files);

        const previews = files.map(file => ({
            url: URL.createObjectURL(file),
            type: file.type,
            name: file.name
        }));

        setFile(prev => [...prev, ...files]);
        setFilePreview(prev => [...prev, ...previews]);
    };


    const handleSendMessage = () => {

        if (currentChat?.is_block) return;

        if (!text && (!File || File.length === 0)) return;


        dispatch(addLocalMessage({
            chatId: selectedChat.id,
            text,
            image_url: FilePreview.map(p => p.url),
            sender_id: user.id,
            is_star: false,
            is_pin: false,
            replyTo: replyMsg || null,
            status: 'sending',
            pending: true,
            createdAt: new Date().toISOString(),
        }));

        const formData = new FormData();
        formData.append("chatId", selectedChat.id);
        formData.append("text", text);

        if (replyMsg != null) {
            formData.append("replyTo", replyMsg.id);
        }

        File.forEach((f) => {
            formData.append("images", f);
        });

        dispatch(SendMessage({ formData }));

        dispatch(UpdateChat({
            chat: {
                id: selectedChat.id,
                last_message: text,
                last_message_time: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                UserOne: selectedChat.UserOne,
                UserTwo: selectedChat.UserTwo,
                unread_count: 0,
            }
        }));

        setReplyMsg(null);
        setText("");

        if (textRef.current) {
            textRef.current.style.height = "40px";
        }

        setTimeout(() => {
            autoResize();
            textRef.current?.focus();

        }, 0);
        removeFile();
    };


    const addEmoji = (emojiData) => {
        const el = textRef.current;
        const start = el.selectionStart;
        const end = el.selectionEnd;

        const newText =
            text.substring(0, start) +
            emojiData.emoji +
            text.substring(end);

        setText(newText);

        setTimeout(() => {
            el.selectionStart = el.selectionEnd = start + emojiData.emoji.length;
            el.focus();
        }, 0);

        autoResize();
    };

    useEffect(() => {
        textRef.current?.focus();
    }, [currentChat]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleTextFunctionallyClick = async () => {
        try {
            const res = await dispatch(shortenMessageText(text)).unwrap();
            const shortText = res?.text || res;
            if (!shortText) return;

            openModal(
                <GlobalModal onClose={closeModal}>
                    <ShortenText
                        message={shortText}
                        onCancel={closeModal}
                        onConfirm={(newText) => {
                            setText(newText);
                            closeModal();
                        }}
                        initialShortText={shortText}
                    />
                </GlobalModal>
            );

        } catch (err) {
            console.log(err);
        }
    };


    useEffect(() => {
        if (selectedChat?.id) {
            setText("");
            setReplyMsg(null);
        }
    }, [selectedChat?.id]);

    return (
        <>

            {replyMsg && (
                <div className="reply-preview">
                    <div className="reply-content">
                        <span className="reply-name">
                            {replyMsg.sender_id === JoinUser ? "You" : selectedChat?.User?.name}
                        </span> <span className="reply-text">
                            {replyMsg.text || "📷 Media"} </span>
                    </div>
                    <span className="reply-close"
                        onClick={() => setReplyMsg(null)}>✕</span>
                </div>
            )}
            <div className="ConversationPanel-serach"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onKeyDown={handleKeyPress}
            >

                <span onClick={() => setShowEmojiPicker(prev => !prev)} className="Emoji"><EmojiIcon /></span>
                {showEmojiPicker && (
                    <div
                        ref={pickerRef}
                        style={{
                            position: "absolute",
                            bottom: "60px",
                            zIndex: 1000,
                            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                            borderRadius: "12px",
                            overflow: "hidden"
                        }}
                    >
                        <Picker onEmojiClick={addEmoji} theme="inherit"
                            searchDisabled={false}
                            skinTonesDisabled={false}
                            previewConfig={{ showPreview: false }}
                            width={300}
                            height={400} />
                    </div>
                )}
                <textarea
                    ref={textRef}
                    placeholder="Type Your Message..."
                    className="ConversationPanel-serach-input"
                    value={text || ""}
                    onChange={handleTypingInput}
                    onPaste={handlePaste}
                    disabled={!canSendMessage}
                    rows={1}
                />
                <input
                    type='file'
                    multiple
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                    disabled={!canSendMessage}

                />
                {text?.length > 20 && (
                    <span onClick={handleTextFunctionallyClick}><TextFunctionallyIcon /></span>
                )}
                <span>
                    <span onClick={() => setShowGifPicker(!showGifPicker)} style={{ cursor: 'pointer' }}>
                        <GifIcon />
                    </span>

                    {showGifPicker && (
                        <div className="gif-picker-popup" ref={gifPickerRef}>
                            <input
                                type="text"
                                placeholder="Search Tenor GIFs..."
                                className="gif-search-input"
                                value={gifSearch}
                                onChange={handleGifSearch}
                                autoFocus
                            />
                            <div className="gif-results-container">
                                {loading ? (
                                    <div className="gif-loader">Loading...</div>
                                ) : (
                                    gifs.map((gif) => (
                                        <img
                                            key={gif.id}
                                            src={gif.media_formats.tinygif.url}
                                            onClick={() => handleSendGif(gif.media_formats.gif.url)}
                                            alt="gif"
                                            className="gif-result-item"
                                        />
                                    ))
                                )}
                                {!loading && gifs.length === 0 && <div className="no-gif">No GIFs found</div>}
                            </div>
                        </div>
                    )}
                </span>
                <span onClick={handleAttachClick}><AttachmentIcon /></span>
                <span onClick={handleSendMessage} ><SendMsgIcon /></span>
            </div>
        </>
    );
}