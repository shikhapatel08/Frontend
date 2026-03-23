import { useNavigate } from "react-router-dom";
import { MenuDotsIcon, PinIcon, MuteIcon, EditProfileIcon, BlockIcon, DeleteIcon } from "../Common Components/Icon/Icon";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { SelectedChat } from "../../Redux/Features/CreateChat";
import { PinedUser } from "../../Redux/Features/Pinslice";
import { MuteUser } from "../../Redux/Features/MuteSlice";
import { Delete } from "../../Redux/Features/DeleteSlice";
import { useModal } from "../../Context/ModalContext";
import { BlockedUser } from "../../Redux/Features/BlockedSlice";
import { useContext, useEffect, useState } from "react";
import { useRef } from "react";
import GlobalModal from "../Global Modal/GlobalModal";
import DeleteChatModal from "../Modal/DeleteChat";
import BlockedChatModal from "../Modal/BlockedUser";
import { ThemeContext } from "../../Context/ThemeContext";
import { formatChat } from "./DateFormat";

export default function ChatListDropdown({
    chat,
    otherUser,
    unreadCount
}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { openModal, closeModal } = useModal();
    const dropdownRef = useRef(null);
    const { selectedChat, chats } = useSelector(state => state.createchat);
    const [openMenuId, setOpenMenuId] = useState(null);
    const { type } = useSelector(state => state.subscriptions);
    const { getThemeStyle, theme } = useContext(ThemeContext);


    const toggleMenu = (id) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };

    const handleProfile = (userId) => {
        navigate(`/ProfilePage/${userId}`);
    };

    const handlePined = (chat) => {

        // const pinnedChats = Array.isArray(chat)
        //     ? chat.filter(c => c.is_pin)
        //     : [];
        const pinnedChats = chats.filter(c => c.is_pin);
        const limit = type === 'Premium' ? 5 : 3;

        if (!chat.is_pin && pinnedChats.length >= limit) {
            toast.error(`You can only pin ${limit} chats on ${type} plan`);
            return;
        }

        dispatch(PinedUser(chat.id))
            .unwrap()
            .then(() => {
                if (chat?.is_pin) {
                    toast.info("Chat unpinned!");
                } else {
                    toast.success("Chat pinned!");
                }

            })
            .catch((err) => {
                if (err) {
                    toast.error(`You can pin only ${limit} chats`);
                }
            });
    };

    const handleMuted = (chat) => {
        dispatch(MuteUser(chat.id)).then(() => {
            toast.info(chat?.is_muted ? "User unmuted!" : "User muted!");
        });
    };

    const blocked = async (chat) => {
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
        closeModal();
    }

    const handelBlocked = (chat) => {
        openModal(
            <GlobalModal onClose={closeModal}>
                <BlockedChatModal
                    onCancel={closeModal}
                    isBlocked={selectedChat?.is_block}
                    onConfirm={() => blocked(chat)}
                />
            </GlobalModal>
        )
    };

    const DeleteChat = async (chat) => {
        try {
            await dispatch(Delete(chat?.id)).unwrap();

            toast.success('Chat deleted successfully!');
            closeModal();

        } catch (error) {
            toast.error('Failed to delete chat');
        }
    };

    const handleDelete = (chat) => {
        openModal(
            <GlobalModal onClose={closeModal}>
                <DeleteChatModal
                    onCancel={closeModal}
                    onConfirm={() => DeleteChat(chat)}
                />
            </GlobalModal>
        )
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    return (
        <>
            <div
                className="Message-right"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "4px"
                }}
            >
                <span style={{ color: "grey", fontSize: "13px" }}>
                    {formatChat(chat?.last_message_time)}
                </span>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

                    <span>{chat?.is_pin ?
                        (<span className="material-symbols-outlined" style={{ color: 'grey' }}>
                            keep
                        </span>) : ""}
                    </span>
                    <span style={{ color: 'grey' }}>{chat?.is_muted ? <MuteIcon /> : ''}</span>
                    {unreadCount > 0 && selectedChat?.id !== chat.id && (
                        <span className="unread-badge">
                            {unreadCount}
                        </span>
                    )}

                    <span onClick={(e) => {
                        e.stopPropagation();
                        toggleMenu(chat.id);
                    }}
                        ref={dropdownRef}>
                        <MenuDotsIcon />
                    </span>
                </div>

                {openMenuId === chat.id && (
                    <div className="Dropdown-Menu" style={getThemeStyle(theme)}>
                        <div className="Dropdown-Item" onMouseDown={() => handleProfile(otherUser.id)}>
                            <EditProfileIcon />
                            View Profile
                        </div>
                        <div className="Dropdown-Item" onMouseDown={() => handlePined(chat)}>
                            <PinIcon />
                            {chat?.is_pin ? 'Unpin' : 'Pin'}</div>
                        <div className="Dropdown-Item" onMouseDown={() => handleMuted(chat)}>
                            <MuteIcon />
                            {chat?.is_muted ? 'Unmute' : "Mute"}</div>
                        <div className="Dropdown-Item" style={{ color: 'red' }} onMouseDown={() => handelBlocked(chat)}>
                            <BlockIcon />
                            {chat?.is_block ? 'Unblocked' : 'Blocked'}</div>
                        <div className="Dropdown-Item" style={{ color: 'red' }} onMouseDown={() => handleDelete(chat)}>
                            <DeleteIcon color={'red'} />
                            Delete</div>
                    </div>
                )}
            </div>
        </>
    );
}