/* eslint-disable react-hooks/immutability */
import React, { useContext, useEffect, useState } from "react";
import { StarIcon, SingleTicksIcon, DoubleTicksIcon, MsgErrorIcon, PinIcon, EditIcon, ReplyIcon, DeleteIcon } from "../Common Components/Icon/Icon";
import { useDispatch, useSelector } from "react-redux";
import { deleteForEveryoneLocal, deleteForMeLocal, PinMsg, Pinmsg, StarMsg, Starmsg } from "../../Redux/Features/SendMessage";
import { useModal } from "../../Context/ModalContext";
import GlobalModal from "../Global Modal/GlobalModal";
import EditMsgModal from "../Modal/EditMsg";
import { EditMsg } from "../../Redux/Features/EditMsg";
import { updateMessageInstant } from "../../Redux/Features/SendMessage";
import { DeleteMe } from "../../Redux/Features/DeleteMeSlice";
import { DeleteEveryone } from "../../Redux/Features/DeleteEveryoneSlice";
import Attachments from "./Attachments";
import DeleteMsg from "../Modal/DeleteMsg";
import { toast } from "react-toastify";
import { ThemeContext } from "../../Context/ThemeContext";
import { useSocket } from "../../Context/SocketContext";


export default function ChatBubble({
    msg,
    selectedMessageId,
    JoinUser,
    selectedChat,
    chatRefs,
    setReplyMsg
}) {

    const dispatch = useDispatch();
    const { openModal, closeModal } = useModal();
    const [openMsgMenu, setOpenMsgMenu] = useState(null);
    
    const Signup = useSelector(state => state.signup.SignupUser);
    const Signin = useSelector(state => state.signin.SigninUser);
    const { type } = useSelector(state => state.subscriptions);
    const { messages } = useSelector(state => state.message);

    const { getThemeStyle, theme } = useContext(ThemeContext);

    const socket = useSocket();

    const user = Object.keys(Signin).length > 0 ? Signin : Signup;

    const isOwn = msg.sender_id === JoinUser;

    const toggleMenu = (id) => {
        setOpenMsgMenu(prev => prev === id ? null : id);
    };

    const bubbleClass = `chat-bubble ${isOwn ? "right" : "left"} ${Number(msg.id) === Number(selectedMessageId) ? "highlight" : ""}`;

    // ---------------- CLICK OUTSIDE MENU ----------------

    useEffect(() => {
        const handleClickOutside = (event) => {
            const msgBubbleOpen = chatRefs.current[openMsgMenu]?.contains(event.target);
            if (openMsgMenu && !msgBubbleOpen) {
                setOpenMsgMenu(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [chatRefs, openMsgMenu]);

    // ---------------- DELETE ----------------

    const handleDeleteMe = (msg) => {
        dispatch(deleteForMeLocal(msg.id));
        dispatch(DeleteMe(msg.id));
        closeModal();
    }

    const handleDeleteForEveryone = (msg) => {
        if (!socket) return;
        socket.emit("msg_delete_for_all", {
            msgId: msg.id,
            chatId: msg.chatId
        });
        dispatch(deleteForEveryoneLocal(msg.id));
        dispatch(DeleteEveryone(msg.id));
        closeModal();
    };


    const openDeleteModal = (msg) => {
        openModal(
            <GlobalModal onClose={closeModal}>
                <DeleteMsg
                    onCancel={closeModal}
                    onConfirmAll={() => handleDeleteForEveryone(msg)}
                    onConfirmMe={() => handleDeleteMe(msg)}
                    isMyMessage={msg.sender_id === user?.id}
                />
            </GlobalModal>
        )
    }

    const handleDelete = (e) => {
        e.stopPropagation();
        openDeleteModal(msg);
        setOpenMsgMenu(null);
    }

    // ---------------- STAR ----------------

    const handleTogglestar = (e) => {
        e.stopPropagation();
        dispatch(Starmsg(msg.id));
        dispatch(StarMsg(msg.id));
        setOpenMsgMenu(null);
    }

    // ---------------- PIN ----------------

    const handelTogglepin = (e) => {
        e.stopPropagation();

        const pinnedMsgs = messages.filter(m => m.is_pin);
        const isPremium = type === 'Premium';

        const maxPins = isPremium ? 3 : 1;

        if (!msg.is_pin && pinnedMsgs.length >= maxPins) {
            toast.error(`You can only pin ${maxPins} message.`);
            return; // Stop here, don't pin
        }

        dispatch(Pinmsg(msg.id));
        dispatch(PinMsg({ chatId: selectedChat?.id, msgId: msg.id }));

        setOpenMsgMenu(null);
    }

    // ---------------- REPLY ----------------

    const handleReply = (e) => {
        e.stopPropagation();
        setReplyMsg(msg);
        setOpenMsgMenu(null);
    }

    const scrollToReply = (msg) => {
        if (!msg.replyTo) return;

        if (msg.replyTo) {
            const el = chatRefs.current[msg.replyTo.id];
            el?.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        setReplyMsg(msg);
    };

    // ---------------- EDIT ----------------

    const openEditModal = (msg) => {
        openModal(
            <GlobalModal onClose={closeModal}>
                <EditMsgModal
                    message={msg}
                    onCancel={closeModal}
                    onConfirm={(updatedText) => {
                        dispatch(updateMessageInstant({ msgId: msg.id, text: updatedText }));

                        dispatch(EditMsg({
                            msgId: msg.id,
                            chatId: msg.chatId || msg.chat_id,
                            text: updatedText
                        }));
                        closeModal();
                    }}
                />
            </GlobalModal>
        )
        setOpenMsgMenu(null);
    }

    const handleEditMsg = (e) => {
        e.stopPropagation();
        openEditModal(msg);
        setOpenMsgMenu(null);
    }

    return (
        <div ref={el => {
            if (el) chatRefs.current[msg.id] = el;
            else delete chatRefs.current[msg.id];
        }}
            className={bubbleClass} onClick={() => toggleMenu(msg.id)}>
            {/* Reply Box */}
            {msg ? (
                <>
                    {msg.replyTo &&
                        (
                            <div className="reply-box"
                                onClick={() => scrollToReply(msg)}>
                                <span className="reply-user">
                                    {msg.replyTo.sender_id === JoinUser ? "You" : selectedChat?.User?.name}
                                </span>
                                <span className="reply-msg">
                                    {msg.replyTo.text || "Media"}
                                </span>
                            </div>
                        )}

                    {/* Text */}
                    {msg.text && (msg.text.startsWith("http") ? (
                        <a href={msg.text} target="_blank" rel="noreferrer" className="chat-link">
                            🔗 {msg.text}
                        </a>
                    ) : (
                        <span className="chat-text">{msg.text}</span>
                    ))}

                    <Attachments
                        msg={msg}
                    />

                    <span className="chat-time">
                        <span className="-row">
                            {msg.is_star && <StarIcon size={10} />}
                            {msg.is_pin && <span className="material-symbols-outlined" style={{ color: '#2e2e2e', fontSize: '15px' }}>keep</span>}
                            <span className="time">{new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                            {!msg.is_receiver && isOwn && (
                                <>
                                    {msg.status === "sending" ? (
                                        <div className="loader"></div>
                                    ) : msg.status === "error" ? (
                                        <span className="msg-error"><MsgErrorIcon size={12} /></span>
                                    ) : (
                                        msg.is_read ? <DoubleTicksIcon /> : <SingleTicksIcon />
                                    )}
                                </>
                            )}
                        </span>
                    </span>

                    {openMsgMenu === msg.id && (
                        <div className="Dropdown" style={getThemeStyle(theme)}>
                            <div className="Dropdown-Item" onMouseDown={handleTogglestar}>
                                <StarIcon />{/*{msg.is_star ? 'Unstar' : 'Star'}*/}
                            </div>
                            <div className="Dropdown-Item" onMouseDown={handelTogglepin}>
                                <span className="material-symbols-outlined" style={{ color: 'inherit' }}>
                                    keep
                                </span>
                                {/*{msg.is_pin ? 'Unpin' : 'Pin'}*/}
                            </div>
                            {msg.text && isOwn &&
                                <div className="Dropdown-Item" onMouseDown={handleEditMsg}>
                                    <EditIcon />
                                </div>
                            }
                            <div className="Dropdown-Item" onMouseDown={handleReply}>
                                <ReplyIcon />
                            </div>
                            <div className="Dropdown-Item" style={{ color: 'red' }} onMouseDown={handleDelete}>
                                <DeleteIcon />
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <>
                    <p>Start Convertion</p>
                </>
            )}
        </div>
    );
};