import React, { useContext, useEffect, useState } from "react";
import { StarIcon, EditIcon, ReplyIcon, DeleteIcon, EmojiIcon, DownArrow, ProfileIcon, SingleTicksIcon, DoubleTicksIcon, MsgErrorIcon } from "../Common Components/Icon/Icon";

import { useDispatch, useSelector } from "react-redux";
import { deleteForEveryoneLocal, deleteForMeLocal, PinMsg, Pinmsg, setReactionLocal, StarMsg, Starmsg } from "../../Redux/Features/SendMessage";
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
import { sendReaction } from "../../Redux/Features/EmojiSlice";
import { formatChatTime } from "./DateFormat";


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
    const [showReactions, setShowReactions] = useState(null);

    const Signup = useSelector(state => state.signup.SignupUser);
    const Signin = useSelector(state => state.signin.SigninUser);
    const { type } = useSelector(state => state.subscriptions);
    const { messages } = useSelector(state => state.message);

    const { getThemeStyle, theme } = useContext(ThemeContext);

    const socket = useSocket();

    const hasReaction = msg.reactions && msg.reactions.length > 0;

    const user = Object.keys(Signin).length > 0 ? Signin : Signup;
    const isOwn = msg.sender_id === JoinUser;


    // const toggleMenu = (id) => {
    //     setOpenMsgMenu(prev => prev === id ? null : id);
    // };

    const reactions = ["😊", "😂", "❤️", "👍", "🙏"];

    const hasAttachment = msg.image_url && msg.image_url.length > 0;

    const bubbleClass = `chat-bubble ${isOwn ? "right" : "left"} ${hasAttachment ? "has-attachment" : ""} ${String(msg.id) === String(selectedMessageId) ? "highlight" : ""} ${hasReaction ? "has-reaction" : ""} ${msg.is_pin ? "pinned-highlight" : ""}`;

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

        dispatch(updateMessageInstant({
            msgId: msg.id,
            chatId: msg.chatId || msg.chat_id,
            text: "This message was deleted",
            is_deleted: true,
            delete_for_all: true
        }));

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

    const handelTogglepin = async (e) => {
        e.stopPropagation();

        const pinnedMsgs = messages.filter(m => m.is_pin);
        const isPremium = type === 'Premium';
        const maxPins = isPremium ? 3 : 1;

        if (!msg.is_pin && pinnedMsgs.length >= maxPins) {
            toast.error(`You can only pin ${maxPins} message.`);
            return;
        }

        // Optimistic UI update
        dispatch(Pinmsg(msg.id));

        try {
            await dispatch(
                PinMsg({ chatId: selectedChat?.id, msgId: msg.id })
            ).unwrap();

        } catch (error) {
            //  API fail → revert UI
            dispatch(Pinmsg(msg.id));

            toast.error("Pin failed, reverted");
        }

        setOpenMsgMenu(null);
    };
    // ---------------- REPLY ----------------

    const handleReply = (e) => {
        e.stopPropagation();
        setReplyMsg(msg);
        setOpenMsgMenu(null);
    }

    const scrollToReply = (msg) => {
        if (!msg.replyMessage) return;

        if (msg.replyMessage) {
            const el = chatRefs.current[msg.replyMessage.id];
            el?.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        // setReplyMsg(msg);
    };

    // ---------------- EDIT ----------------

    const openEditModal = (msg) => {
        openModal(
            <GlobalModal onClose={closeModal}>
                <EditMsgModal
                    message={msg}
                    onCancel={closeModal}
                    onConfirm={(updatedText) => {
                        if (!updatedText.trim() || updatedText === msg.text) return;
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

    const handleReact = (emoji) => {
        try {
            const existing = msg.reactions?.find(r => r.user_id === user.id);

            // SAME emoji → remove
            if (existing && existing.emoji === emoji) {
                dispatch(sendReaction({
                    messageId: msg.id,
                    emoji
                }));

                dispatch(setReactionLocal({
                    msgId: msg.id,
                    userId: user.id,
                    emoji: null
                }));

                socket?.emit("remove_reaction", {
                    msgId: msg.id
                });

            } else {
                // add/update reaction
                dispatch(sendReaction({
                    messageId: msg.id,
                    emoji
                }));

                dispatch(setReactionLocal({
                    msgId: msg.id,
                    userId: user.id,
                    emoji
                }));

                socket?.emit("send_reaction", {
                    msgId: msg.id,
                    emoji
                });
            }

            // Close UI menus
            setShowReactions(null);
            setOpenMsgMenu(null);

        } catch (error) {
            console.error("Failed to handle reaction:", error);
            toast.error("Unable to add reaction. Try again.");
        }
    };

    const groupedReactions = Object.values(
        (msg.reactions || []).reduce((acc, r) => {
            if (!acc[r.emoji]) {
                acc[r.emoji] = { emoji: r.emoji, count: 0 };
            }
            acc[r.emoji].count++;
            return acc;
        }, {})
    );

    const truncateMessage = (message, limit = 90) => {
        if (!message) return "";
        const trimmed = message.trim();
        return trimmed.length > limit
            ? trimmed.slice(0, limit) + "..."
            : trimmed;
    };

    return (
        <div
            ref={el => {
                if (el) chatRefs.current[msg.id] = el;
                // else delete chatRefs.current[msg.id];
            }}
            className={`chat-message-item ${isOwn ? "own" : "other"}`}
        >

            <div className="msg-time-header">
                <span className="time">{formatChatTime(msg.createdAt, "list")}</span>
                {msg.is_edited && <span className="edited"> • Edited</span>}
                {msg.is_pin && (
                    <div className="pinned-label">
                        📌 Pinned
                    </div>
                )}
                {msg.is_star && <StarIcon size={13} color={'#2153a3ff'} fill={'#2153a3ff'} />}
                {isOwn && !msg.delete_for_all && (
                    <div className="msg-status-icon">
                        {msg.status === "error" ? (
                            <MsgErrorIcon size={14} />
                        ) : msg.status === "pending" ? (
                            <span className="loader-small"></span>
                        ) : msg.status === "seen" || (msg.seenBy && msg.seenBy.length > 0) ? (
                            <DoubleTicksIcon />
                        ) : (
                            <SingleTicksIcon />
                        )}
                    </div>
                )}
            </div>



            <div className={bubbleClass} >

                <div
                    className="msg-arrow"
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpenMsgMenu(prev => prev === msg.id ? null : msg.id);
                    }}
                >
                    <DownArrow />
                </div>

                {msg.replyTo && (
                    <div className="reply-box" onClick={() => scrollToReply(msg)}>
                        <span className="reply-user">
                            {msg.replyTo?.sender_id === JoinUser ? "You" : selectedChat?.User?.name}
                        </span>
                        <span className="reply-msg">
                            {truncateMessage(msg.replyTo?.text
                                ? msg.replyTo?.text
                                : msg.replyTo?.image_url
                                    ? "📷 Photo"
                                    : "Attachment")}
                        </span>
                    </div>
                )}

                {/* Images */}
                <Attachments msg={msg} />

                {/* Caption (Text) */}
                {msg.text && (
                    <div className="media-caption">
                        {msg.text}
                    </div>
                )}

                {/* Dropdown Menu */}
                {openMsgMenu === msg.id && !msg.delete_for_all && (
                    <div className="Dropdown" style={getThemeStyle(theme)}>
                        <div className="Dropdown-Item" onMouseDown={handleTogglestar}>
                            <StarIcon
                                size={16}
                                color={msg.is_star ? "#FFD700" : "currentColor"}
                                fill={msg.is_star ? "#FFD700" : "none"}
                            />
                        </div>
                        <div className="Dropdown-Item" onMouseDown={handelTogglepin}>
                            <span className="material-symbols-outlined" style={{ color: 'inherit', fontSize: '18px' }}>keep</span>

                        </div>
                        {msg.text && isOwn &&
                            <div className="Dropdown-Item" onMouseDown={handleEditMsg}>
                                <EditIcon />
                            </div>
                        }
                        <div className="Dropdown-Item"
                            onMouseDown={(e) => {
                                e.stopPropagation();
                                setShowReactions(prev => prev === msg.id ? null : msg.id);
                            }}
                        >
                            <EmojiIcon />

                            {showReactions === msg.id && (
                                <div className="reaction-box">
                                    {reactions.map((emoji, index) => (
                                        <span
                                            key={index}
                                            onMouseDown={(e) => { e.stopPropagation(); handleReact(emoji) }}
                                        >
                                            {emoji}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="Dropdown-Item" onMouseDown={handleReply}>
                            <ReplyIcon />
                        </div>
                        <div className="Dropdown-Item delete-action" onMouseDown={handleDelete}>
                            <DeleteIcon />
                        </div>
                    </div>
                )}
            </div>

            <div className="msg-footer">
                {!msg.delete_for_all &&
                    <>

                        {
                            groupedReactions.length > 0 && (
                                <div className="reaction-badge">
                                    <div className="reaction-items">
                                        {groupedReactions.map((r, i) => (
                                            <span key={i} className="emoji">{r.emoji}</span>
                                        ))}
                                    </div>
                                    <span className="count">{msg.reactions.length}</span>
                                </div>
                            )
                        }
                    </>
                }
            </div>
        </div >
    );
}
