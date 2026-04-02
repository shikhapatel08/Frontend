import { useNavigate } from "react-router-dom";
import { toggleSidebar } from "../../Redux/Features/SideBarSlice";
import "../Starred Msg/StarredMsg.css";

import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect } from "react";

import { GetStarredMsg, StarredMsgChat, resetStarredState } from "../../Redux/Features/StarredMsg";
import { SelectedMessage } from "../../Redux/Features/SearchMsgSlice";
import { SelectedChat } from "../../Redux/Features/CreateChat";

import { useLayoutStyle } from "../../Components/Common Components/Common/CommonComponents";
import { MenuIcon } from "../../Components/Common Components/Icon/Icon";

import profile from "../../assets/Profile/profile.svg";
import InfiniteScroll from "react-infinite-scroll-component";
import { ThemeContext } from "../../Context/ThemeContext";
import Loader from "../../Components/Common Components/Loader/Loader";
import { StarredSkeleton } from "../../Components/Common Components/Loader/PageSkeletons";
import { FetchMessages, resetMessages } from "../../Redux/Features/SendMessage";



export default function StarredMsg({ type, chatId }) {

    /* ---------------- HOOKS ---------------- */

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const style = useLayoutStyle();

    const { starredMessages, loading, page, hasMore } = useSelector((state) => state.starredMsg);
    const { chats, selectedChat } = useSelector((state) => state.createchat);

    const { theme, getThemeStyle } = useContext(ThemeContext);

    const isChatView = type === "Chat";

    /* ---------------- FETCH DATA ---------------- */

    useEffect(() => {
        dispatch(resetStarredState());

        if (isChatView) {
            dispatch(StarredMsgChat({ chatId, page: 1 }));
        } else {
            dispatch(GetStarredMsg({ page: 1 }));
        }

    }, [dispatch, isChatView, chatId]);

    /* ---------------- LOAD MORE ---------------- */

    const fetchMore = () => {
        if (!hasMore) return;

        if (isChatView) {
            dispatch(StarredMsgChat({ chatId, page }));
        } else {
            dispatch(GetStarredMsg({ page }));
        }
    };

    /* ---------------- OPEN MESSAGE ---------------- */

    // const handleStarredMsg = (msg) => {

    // const chatId = msg.setting?.[0]?.chat_id;


    // const chatInStore = chats.find(
    //     (chat) => chat.id === chatId
    // );

    // const formattedChatForRedux = {
    //     id: msg.chat_id,
    //     User: {
    //         id: msg.sender?.id,
    //         name: msg.sender?.name,
    //         photo: msg.sender?.photo || null,
    //         is_online: false
    //     },
    //     is_block: false,
    //     is_pin: false,
    //     is_muted: false
    // };

    // dispatch(resetMessages())

    // dispatch(FetchMessages({
    //     chatId: msg.chat_id,
    //     page: msg.page
    // }));

    // dispatch(SelectedChat(formattedChatForRedux))
    // // setTimeout(() => {
    // dispatch(SelectedMessage(msg.id));
    // // }, 300);

    // navigate("/MessagePage");
    // };


    /* ---------------- NAVIGATION ---------------- */

    const handleSidebar = () => dispatch(toggleSidebar());

    /* ---------------- UI ---------------- */

    return (
        <div
            className={`starred-messages-container ${isChatView ? "chat-view" : "full-view"}`}
            style={{ ...(isChatView ? {} : style), ...getThemeStyle(theme) }}
        >
            {!isChatView && <div className="starred-header-section">
                <div className="title" style={{ display: 'flex', alignItems: 'center' }}>
                    <span onClick={handleSidebar} style={{ cursor: 'pointer', display: 'flex' }}>
                        <MenuIcon />
                    </span>
                    <span>
                        <h2 style={{
                            margin: '0px',
                            marginLeft: '15px',
                            fontSize: '1.5rem' // જરૂર મુજબ સાઈઝ સેટ કરી શકાય
                        }}>
                            Starred
                        </h2>
                    </span>
                </div>
            </div>
            }


            <div className="starred-content-wrapper">
                {loading && starredMessages.length === 0 ? (
                    <StarredSkeleton count={5} />
                ) : starredMessages.length === 0 ? (

                    <div className="empty-starred-state">
                        <div className="empty-starred-icon">⭐</div>
                        <p>No starred messages yet</p>
                        <span>Long press or right-click a message to star it</span>
                    </div>
                ) : (
                    <InfiniteScroll
                        dataLength={starredMessages.length}
                        next={fetchMore}
                        hasMore={hasMore}
                        scrollThreshold={0.8}
                        loader={<Loader size="small" text="Loading more..." />}
                    >
                        <div className="starred-grid">
                            {starredMessages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className="starred-card"
                                // onClick={() => handleStarredMsg(msg)}
                                >
                                    <div className="starred-card-inner">
                                        <div className="starred-user-avatar">
                                            <img
                                                src={msg.sender?.photo || profile}
                                                alt={msg.sender?.name}
                                            />
                                            <div className="star-badge">⭐</div>
                                        </div>

                                        <div className="starred-main-content">
                                            <div className="starred-card-header">
                                                <h4 className="starred-sender-name">{msg.sender?.name || "User"}</h4>
                                                <span className="starred-date">
                                                    {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : ""}
                                                </span>
                                            </div>
                                            <div className="starred-text-preview">
                                                {msg.text ? (
                                                    <p>{msg.text}</p>
                                                ) : (
                                                    <span className="media-placeholder">
                                                        📷 Media attachment
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="starred-arrow">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="9 18 15 12 9 6"></polyline>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </InfiniteScroll>
                )}
            </div>
        </div>
    );
}
