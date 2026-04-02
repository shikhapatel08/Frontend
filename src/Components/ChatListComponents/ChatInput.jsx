import { useRef, useState, useEffect } from "react";
import { AttachmentIcon, SendMsgIcon, EmojiIcon, TextFunctionallyIcon } from "../Common Components/Icon/Icon";
import { useDispatch, useSelector } from "react-redux";
import { addLocalMessage, SendMessage } from "../../Redux/Features/SendMessage";
import { useSocket } from "../../Context/SocketContext";
import { UpdateChat } from "../../Redux/Features/CreateChat";
import Picker from "emoji-picker-react";
import { useReplySuggestion } from "./CustomHook/useReplySuggestion";
import { shortenMessageText } from "../../Redux/Features/TextFunctionally";
import { useModal } from "../../Context/ModalContext";
import GlobalModal from "../Global Modal/GlobalModal";
import ShortenText from "../Modal/ShortenText";

export default function ChatInput({ text, fileInputRef, selectedChat, setText, setFilePreview, setFile, FilePreview, replyMsg, setReplyMsg, File, currentChat, JoinUser }) {
    const dispatch = useDispatch();
    const Signup = useSelector(state => state.signup.SignupUser);
    const Signin = useSelector(state => state.signin.SigninUser);
    const { canSendMessage } = useSelector(state => state.message);

    const { openModal, closeModal } = useModal();


    const user = Object.keys(Signin).length > 0 ? Signin : Signup;
    const socket = useSocket();

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const textRef = useRef(null);
    const pickerRef = useRef(null);



    const autoResize = () => {
        const el = textRef.current;
        if (!el) return;

        el.style.height = "auto";        // reset
        el.style.height = el.scrollHeight + "px"; // set new height
    };
    // ---------------- TYPING ----------------

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

    // ---------------- ENTER KEY ----------------

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // ---------------- FILE UPLOAD ----------------

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        const previews = files.map(file => URL.createObjectURL(file));

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

                const preview = URL.createObjectURL(file);

                setFile(prev => [...prev, file]);
                setFilePreview(prev => [...prev, preview]);
            }
        }

        const content = e.clipboardData.getData("text/plain");
        if (content) {
            e.preventDefault();
            // If some text is selected, replace it
            const start = el.selectionStart;
            const end = el.selectionEnd;
            const newText = text.substring(0, start) + content + text.substring(end);
            setText(newText);

            // Set cursor after pasted text
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

        const previews = files.map(file => URL.createObjectURL(file));

        setFile(prev => [...prev, ...files]);
        setFilePreview(prev => [...prev, ...previews]);
    };

    // ---------------- SEND MESSAGE ----------------

    const handleSendMessage = () => {

        if (currentChat?.is_block) return;

        if (!text && (!File || File.length === 0)) return;

        const tempId = Date.now();

        dispatch(addLocalMessage({
            id: tempId,
            // id:messages.msg.id,
            chatId: selectedChat.id,
            text,
            image_url: FilePreview,
            sender_id: user.id,
            is_star: false,
            is_pin: false,
            replyTo: replyMsg || null,
            status: 'sending',
            pending: true,
            createdAt: new Date().toISOString(),
        }));

        dispatch(SendMessage({
            tempId,
            chatId: selectedChat.id,
            messageText: text,
            file: File,
            replyTo: replyMsg?.id || null
        }));

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
            textRef.current.style.height = "40px"; // reset height
        }

        setTimeout(() => {
            autoResize();
            textRef.current?.focus();

        }, 0);
        removeFile();
        // setReplySuggestions([]);
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
            // setText(shortText);

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
                // onPaste={handlePaste}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onKeyDown={handleKeyPress}
            >

                <span onClick={() => setShowEmojiPicker(prev => !prev)}><EmojiIcon /></span>
                {showEmojiPicker && (
                    <div
                        ref={pickerRef}
                        style={{
                            position: "absolute",
                            bottom: "60px",
                            // right: "20px",
                            zIndex: 1000,
                            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                            borderRadius: "12px",
                            overflow: "hidden"
                        }}
                    >
                        <Picker onEmojiClick={addEmoji} theme="dark"
                            searchDisabled={false}
                            skinTonesDisabled={false}
                            previewConfig={{ showPreview: false }}
                            width={300}
                            height={400} />
                    </div>
                )}
                <textarea
                    // type='text'
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
                <span onClick={handleAttachClick}><AttachmentIcon /></span>
                <span onClick={handleSendMessage} ><SendMsgIcon /></span>
            </div>
        </>
    );
}
