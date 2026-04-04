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
import { ChatItem } from "./ChatItem";


export default function ChatList({ typingChatId }) {
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


    const fetchMore = useCallback(() => {
        if (!hasMore) return;

        if (hasMore) dispatch(fetchMyChats({ page }));
    }, [dispatch, hasMore, page]);


    const sortedChats = useMemo(() => {
        if (!chats) return [];
        const pinnedChats = [];
        const unpinnedChats = [];

        chats.forEach(chat => {
            if (chat.is_pin) {
                pinnedChats.push(chat);
            } else {
                unpinnedChats.push(chat);
            }
        });
        pinnedChats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        unpinnedChats.sort((a, b) => {
            const aUnread = a.unread_count || a.ChatSettings?.[0]?.unread_count || 0;
            const bUnread = b.unread_count || b.ChatSettings?.[0]?.unread_count || 0;

            if (aUnread > 0 && bUnread === 0) return -1;
            if (aUnread === 0 && bUnread > 0) return 1;

            return new Date(b.updatedAt) - new Date(a.updatedAt);
        });
        return [...pinnedChats, ...unpinnedChats];
    }, [chats]);

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


    const handleHamburgerIcon = () => {
        dispatch(toggleSidebar());
    };

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
            <div className="Message">
                <div className="title" style={{ display: 'flex', alignItems: 'center' }}>
                    <span onClick={handleHamburgerIcon} style={{ cursor: 'pointer', display: 'flex' }}>
                        <MenuIcon />
                    </span>
                    <span>
                        <h2 style={{
                            margin: '0px',
                            marginLeft: '15px',
                            fontSize: '1.5rem'
                        }}>
                            Message
                        </h2>
                    </span>
                </div>
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
                        (sortedChats.map((chat) => (
                            <ChatItem
                                key={chat.id}
                                chat={chat}
                                selectedChat={selectedChat}
                                handleChatList={handleChatList}
                                typingChatId={typingChatId}
                                truncateMessage={truncateMessage}
                                JoinUser={JoinUser}
                                profileImg={profileImg}
                            />
                        ))) : (
                            <>
                                <p style={{ color: 'grey' }} className="default">Chat will appear here after you send or receive a message.</p>

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
        </div >
    )
}
