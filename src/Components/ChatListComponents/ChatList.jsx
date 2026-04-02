import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyChats, SelectedChat, UnreadCount } from "../../Redux/Features/CreateChat";
import { toggleSidebar } from "../../Redux/Features/SideBarSlice";
import profileImg from "../../assets/Profile/profile.svg";
import '../../Pages/ChatList/ChatListPage.css'
import { Icon, MenuIcon } from "../Common Components/Icon/Icon";
import GlobalModal from "../Global Modal/GlobalModal";
import ChatListDropdown from "./ChatListDropdown";
import InfiniteScroll from 'react-infinite-scroll-component';
import { useUnreadCount } from "./CustomHook/useUnreadCount";
import { useChatUpdate } from "./CustomHook/useChatUpdate";
import { useEditText } from "./CustomHook/useEditText";
import { useModal } from "../../Context/ModalContext";
import SendMsgModal from "../Modal/SendMessageModal";
import Button from "../Button/Button";
import { ChatListSkeleton } from "../Common Components/Loader/PageSkeletons";


export default function ChatList({ isOtherTyping }) {
    const dispatch = useDispatch();
    const { chats, selectedChat, page, hasMore, loading } = useSelector(state => state.createchat);

    const Signup = useSelector(state => state.signup.SignupUser);
    const Signin = useSelector(state => state.signin.SigninUser);
    const { openModal, closeModal } = useModal();

    const user = Object.keys(Signin).length > 0 ? Signin : Signup;
    const JoinUser = user?.id;

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    useUnreadCount();
    useChatUpdate();
    useEditText();

    // ---------------- FETCH MORE ----------------

    const fetchMore = useCallback(() => {
        if (!hasMore) return;

        if (hasMore) dispatch(fetchMyChats({ page }));
    }, [dispatch, hasMore, page]);

    // ---------------- SORT CHATS ----------------

    const sortedChats = useMemo(() => {
        // Early return if there are no chats
        if (!chats) return [];
        // Separate pinned and unpinned chats
        const pinnedChats = [];
        const unpinnedChats = [];

        chats.forEach(chat => {
            if (chat.is_pin) {
                pinnedChats.push(chat);
            } else {
                unpinnedChats.push(chat);
            }
        });
        // Sort pinned chats by latest activity
        pinnedChats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        // Sort unpinned chats
        unpinnedChats.sort((a, b) => {
            const aUnread = a.unread_count || a.ChatSettings?.[0]?.unread_count || 0;
            const bUnread = b.unread_count || b.ChatSettings?.[0]?.unread_count || 0;

            if (aUnread > 0 && bUnread === 0) return -1;
            if (aUnread === 0 && bUnread > 0) return 1;

            return new Date(b.updatedAt) - new Date(a.updatedAt);
        });
        // Combine pinned + unpinned
        return [...pinnedChats, ...unpinnedChats];
    }, [chats]);

    // ---------------- CHAT USER ----------------

    const getChatUser = (chat, joinUserId) => {
        return chat.UserOne.id === joinUserId
            ? chat.UserTwo
            : chat.UserOne;
    };

    // ---------------- SELECT CHAT ----------------

    const handleChatList = useCallback((chat, otherUser) => {
        dispatch(UnreadCount({ chatId: chat.id, unread_count: 0 }));
        const chatData = {
            id: chat.id,
            is_block: chat.is_block,
            is_pin: chat.is_pin,
            is_muted: chat.is_muted,
            User: otherUser
        };
        dispatch(SelectedChat(chatData));
    }, [dispatch]);

    // ---------------- SIDEBAR ----------------

    const handleHamburgerIcon = () => {
        dispatch(toggleSidebar());
    };

    // ---------------- UTILS ----------------

    const truncateMessage = (message, limit = 15) => {
        if (!message) return "";
        const trimmed = message.trim();
        return trimmed.length > limit
            ? trimmed.slice(0, limit) + "..."
            : trimmed;
    };

    const handleButton = () => {
        openModal(
            <GlobalModal onClose={closeModal}>
                <SendMsgModal
                    onCancel={closeModal}
                />
            </GlobalModal>
        )
    }

    return (
        <div className="Message-detail" id="chatListScrollable">
            {/* {loading ? (
                <div className="loader-conatainer">
                    <div className="loader"></div>
                </div>
            ) : (<> */}
            <div className="Message">
                <div className="title" style={{ display: 'flex', alignItems: 'center' }}>
                    <span onClick={handleHamburgerIcon} style={{ cursor: 'pointer', display: 'flex' }}>
                        <MenuIcon />
                    </span>
                    <span>
                        <h2 style={{
                            margin: '0px',
                            marginLeft: '15px',
                            fontSize: '1.5rem' // જરૂર મુજબ સાઈઝ સેટ કરી શકાય
                        }}>
                            Message
                        </h2>
                    </span>
                </div>
                {/* <input
                    placeholder="searching..."
                    className="Message-user-searching"
                /> */}
            </div>
            {loading && chats.length === 0 ? (
                <ChatListSkeleton count={8} />
            ) : (
                <InfiniteScroll
                    dataLength={chats.length}

                    next={fetchMore}
                    hasMore={hasMore}
                    scrollableTarget="chatListScrollable"
                    scrollThreshold={0.8}
                    style={{ overflow: 'visible' }}
                >
                    {sortedChats.length > 0 ?
                        (sortedChats.map((chat) => {
                            const otherUser = getChatUser(chat, JoinUser);
                            const unreadCount = chat.unread_count || chat.ChatSettings?.[0]?.unread_count || 0;
                            return (
                                <div className={unreadCount > 0 && selectedChat?.id !== chat.id ? 'MessageUser' : "Message-User"} key={chat.id} onClick={() => handleChatList(chat, otherUser)} style={{ cursor: "pointer" }}>
                                    <>
                                        <div className="Message-Profile-img">
                                            <img src={otherUser?.photo ? otherUser?.photo : profileImg} alt='profile' />
                                            {/* {chats.unread_count > 0 && <span className="online-dot"></span>} */}
                                        </div>
                                        <div className="Message-Username">
                                            <h2 className="chat-name">{otherUser?.name}</h2>
                                            {isOtherTyping ? <span style={{ color: 'green' }}>Typing...</span> : <span className="chat-last-message" style={{ color: 'grey' }}>{truncateMessage(chat?.last_message)}</span>}
                                        </div>
                                        <ChatListDropdown
                                            chat={chat}
                                            otherUser={otherUser}
                                            unreadCount={unreadCount}
                                        />
                                    </>
                                </div>
                            )
                        })) : (
                            <>
                                <p style={{ color: 'grey' }}>Chat will appear here after you send or receive a message.</p>

                                {isMobile &&

                                    <div className="ConversationPanel-placeholder">
                                        <span><Icon /></span>
                                        <h2>Your messages</h2>
                                        <p>Send a message to start a chat.</p>
                                        <br></br>
                                        <Button onClick={handleButton}>Send Message</Button>
                                    </div>
                                }
                            </>
                        )
                    }
                </InfiniteScroll>
            )}
            {/* </>)} */}

        </div >
    )
}
