import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyChats, SelectedChat } from "../../Redux/Features/CreateChat";
import { ProfileUser } from "../../Redux/Features/ProfileSlice";
import { useModal } from "../../Context/ModalContext";
import { FetchMessages, PinMsg, Pinmsg, resetMessages, SendMessage, Starmsg, StarMsg } from "../../Redux/Features/SendMessage";
import { DeleteMe } from "../../Redux/Features/DeleteMeSlice";
import { DeleteEveryone } from "../../Redux/Features/DeleteEveryoneSlice";
import { BlockedUser } from "../../Redux/Features/BlockedSlice";
import { toast } from "react-toastify";
import { SelectedMessage } from "../../Redux/Features/SearchMsgSlice";
import Searching from "../Modal/Seraching";
import { FaFileAlt, FaFileExcel, FaFilePdf, FaFileWord } from "react-icons/fa";
import { AttachmentIcon, BackbtnIcon, DoubleTicksIcon, Icon, SendMsgIcon, SerachIcon, SingleTicksIcon, StarIcon } from "../Common Components/Icon/Icon";
import StarredMsg from "../../Pages/Starred Msg/StarredMsg";
import GlobalModal from "../Global Modal/GlobalModal";
import DeleteMsg from "../Modal/DeleteMsg";
import ChatHeader from "./ChatHeader";
import MessageList from './MessageList'
import FilePreviewList from "./FilePreviewList";
import ChatInput from "./ChatInput";
import BlockedChatModal from "../Modal/BlockedUser";
import Button from "../Button/Button";
import SendMsgModal from "../Modal/SendMessageModal";


export default function ChatPanel() {
    const dispatch = useDispatch();
    const { chats, selectedChat } = useSelector(state => state.createchat);
    const [openMenuId, setOpenMenuId] = useState(null);
    const chatRefs = useRef({});
    const fileInputRef = useRef(null);
    const { messages } = useSelector(state => state.message);
    const [text, setText] = useState("");
    const [isOtherTyping, setIsOtherTyping] = useState(false);
    const [replyMsg, setReplyMsg] = useState(null);
    const [FilePreview, setFilePreview] = useState([]);
    const [File, setFile] = useState([]);
    const { openModal, closeModal } = useModal();
    const { selectedMessageId } = useSelector(state => state.searchMsg);
    const [pinIndex, setPinIndex] = useState(0);
    const Signup = useSelector(state => state.signup.SignupUser);
    const Signin = useSelector(state => state.signin.SigninUser);
    const user = Object.keys(Signin).length > 0 ? Signin : Signup;
    const JoinUser = user?.id;
    const chatEndRef = useRef(null);

    const pinnedMessage = useMemo(() => {
        return messages?.filter(
            msg => msg.is_pin && Number(msg.chatId) === Number(selectedChat?.id)
        );
    }, [messages, selectedChat?.id]);

    const handleNextPin = () => {
        if (!pinnedMessage.length) return;

        setPinIndex(prev => (prev + 1) % pinnedMessage.length);
    };

    const currentChat = useMemo(() =>
        chats.find(c => c.id === selectedChat?.id),
        [chats, selectedChat?.id]
    );

    const filteredMessages = useMemo(() => {
        return messages?.filter(m => Number(m.chatId) === Number(selectedChat?.id));
    }, [messages, selectedChat?.id]);

    const Blocked = async (chat) => {
        await dispatch(BlockedUser(chat.id)).then(() => {
        });
        if (chat?.is_block) {
            toast.success("User unblocked!");
        } else {
            toast.error("User blocked!");
        }
        const updatedChat = { ...chat, is_block: !chat.is_block };
        if (selectedChat?.id === chat.id) {
        dispatch(SelectedChat({
            ...selectedChat,
            is_block: updatedChat.is_block
        }));
    }
    };

    const handleBlocked = (chat) => {
        openModal(
            <GlobalModal onClose={closeModal}>
                <BlockedChatModal
                    onCancel={closeModal}
                    isBlocked={selectedChat?.is_block}
                    onConfirm={() => {
                        Blocked(chat);
                        closeModal();
                    }}
                />
            </GlobalModal>
        )
    };

    const removeSingleFile = (index) => {
        const newPreviews = [...FilePreview];
        const newFiles = [...File];

        URL.revokeObjectURL(newPreviews[index]);

        newPreviews.splice(index, 1);
        newFiles.splice(index, 1);

        setFilePreview(newPreviews);
        setFile(newFiles);
    };

    useEffect(() => {
        return () => {
            FilePreview.forEach(url => URL.revokeObjectURL(url));
        };
    }, [FilePreview]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const chatMenuOpen = chatRefs.current[openMenuId]?.contains(event.target);
            if (openMenuId && !chatMenuOpen) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [openMenuId]);

    useEffect(() => {
        if (selectedChat?.id) {
            dispatch(resetMessages())
            dispatch(FetchMessages({ chatId: selectedChat.id, page: 1 }));
        }
    }, [selectedChat?.id, dispatch]);


    useEffect(() => {
        if (!JoinUser) return;
        dispatch(fetchMyChats({ page: 1 }));
    }, [JoinUser, dispatch]);


    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({
                behavior: "smooth",
                block: "end"
            });
        }
    }, [messages?.length]);

    useEffect(() => {
        if (!selectedMessageId) return;

        const el = chatRefs.current[selectedMessageId];

        if (el) {
            el.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            setTimeout(() => {
                dispatch(SelectedMessage(null));
            }, 2000);
        }
    }, [selectedMessageId, messages]);


    useEffect(() => {
        if (pinnedMessage) {
            localStorage.setItem('PinnedMsg', pinnedMessage.text);
        }
    }, [pinnedMessage]);

    const handleButton = () => {
        openModal(
            <GlobalModal onClose={closeModal}>
                <SendMsgModal
                    onCancel={closeModal}
                />
            </GlobalModal>
        )
    }

    console.log(selectedChat)
    // console.log(chats)

    return (
        // ================================= Chat Window ================================= //
        <div className="ConversationPanel-User">

            {selectedChat ? (
                <>
                    {/* Chat Header */}

                    <ChatHeader
                        selectedChat={selectedChat}
                        JoinUser={JoinUser}
                        currentChat={currentChat}
                    />

                    {/* Pinned Message */}
                    {pinnedMessage.length > 0 && (
                        <div className="pinned-msg" onClick={handleNextPin}>

                            <div className="pin-indicator">
                                {pinnedMessage.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`pin-dot ${i === pinIndex ? "active" : ""}`}
                                    />
                                ))}
                            </div>
                            <span className="material-symbols-outlined" style={{ color: 'grey' }}>keep</span>

                            <p className="pin-text">
                                {pinnedMessage[pinIndex]?.text}
                            </p>

                        </div>
                    )}
                    {/* Chat Messages */}
                    {/* {loading ? (
                        <div className="loader-conatainer">
                            <div className="loader"></div>
                        </div>
                    ) : (<> */}
                    <MessageList
                        messages={filteredMessages}
                        selectedMessageId={selectedMessageId}
                        JoinUser={JoinUser}
                        selectedChat={selectedChat}
                        isOtherTyping={isOtherTyping}
                        chatRefs={chatRefs}
                        chatEndRef={chatEndRef}
                        setReplyMsg={setReplyMsg}
                        currentChat={currentChat}
                        setIsOtherTyping={setIsOtherTyping}
                        chats={chats}
                    />
                    {/* </>
                    )} */}

                    {currentChat?.is_block && (
                        <div className="blocked-user">
                            <h4>You've blocked this account</h4>

                            <Button onClick={() => handleBlocked(currentChat)}>
                                Unblock
                            </Button>
                        </div>
                    )}

                    {replyMsg && (
                        <div className="reply-preview">
                            <div className="reply-content">
                                <span className="reply-name">
                                    {replyMsg.sender_id === JoinUser ? "You" : selectedChat?.User?.name}
                                </span> <span className="reply-text">
                                    {replyMsg.text || "📷 Image"} </span>
                            </div>
                            <span className="reply-close"
                                onClick={() => setReplyMsg(null)}>✕</span>
                        </div>
                    )}

                    {/* File Previews */}
                    <FilePreviewList
                        FilePreview={FilePreview}
                        removeSingleFile={removeSingleFile}
                    />

                    <div className="ConversationPanel-bottom">
                        {!currentChat?.is_block &&
                            <>
                                {/* Chat Input */}
                                < ChatInput
                                    text={text}
                                    setText={setText}
                                    selectedChat={selectedChat}
                                    fileInputRef={fileInputRef}
                                    setFile={setFile}
                                    setFilePreview={setFilePreview}
                                    FilePreview={FilePreview}
                                    setReplyMsg={setReplyMsg}
                                    replyMsg={replyMsg}
                                    setIsOtherTyping={setIsOtherTyping}
                                    File={File}
                                    currentChat={currentChat}
                                />
                            </>
                        }
                    </div>

                </>
            ) : (
                <div className="ConversationPanel-placeholder">
                    <span><Icon /></span>
                    <h2>Your messages</h2>
                    <p>Send a message to start a chat.</p>
                    <br></br>
                    <Button onClick={handleButton}>Send Message</Button>
                </div>
            )}
        </div>
    );

}