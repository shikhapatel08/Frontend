import { useContext, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { DeleteNoti, DeleteNotification, FetchNotifications, SeenNotification, resetNotifications } from "../../Redux/Features/NotificationSlice"
import '../Notification/Notification.css'
import { useNavigate } from "react-router-dom";
import { SelectedMessage } from "../../Redux/Features/SearchMsgSlice";
import { useLayoutStyle } from "../../Components/Common Components/Common/CommonComponents";
import { DeleteIcon, MenuDotsIcon, MenuIcon } from "../../Components/Common Components/Icon/Icon";
import { toggleSidebar } from "../../Redux/Features/SideBarSlice";
import { SelectedChat } from "../../Redux/Features/CreateChat";
import profile from "../../assets/Profile/profile.svg";
import InfiniteScroll from 'react-infinite-scroll-component';
import { ThemeContext } from "../../Context/ThemeContext";
import Loader from "../../Components/Common Components/Loader/Loader";
import Skeleton from "../../Components/Common Components/Loader/Skeleton";
import { FetchMessages, resetMessages } from "../../Redux/Features/SendMessage";


export default function Notification() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const style = useLayoutStyle();
    const dropdownRef = useRef(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const { notifications, loading, page, hasMore } = useSelector(state => state.notifications);
    const { chats } = useSelector(state => state.createchat);
    const { theme, getThemeStyle } = useContext(ThemeContext);

    /* ---------------- FETCH NOTIFICATION ---------------- */

    const FetchMore = () => {
        if (!hasMore) return;
        dispatch(FetchNotifications({ page }));
    }

    useEffect(() => {
        dispatch(resetNotifications());
        dispatch(FetchNotifications({ page: 1 }))
    }, [dispatch]);

    /* ---------------- NAVIGATION ---------------- */

    // const handleBackbtn = () => {
    //     navigate(-1);
    // }

    const handleSidebar = () => {
        dispatch(toggleSidebar());
    }

    /* ---------------- MENU ---------------- */

    const toggleMenu = (id) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };

    /* ---------------- CLICK OUTSIDE ---------------- */

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    /* ---------------- NOTIFICATION CLICK ---------------- */


    const handleNotification = (item) => {

        dispatch(SeenNotification(item.id));

        const chatId = item?.Chat?.id;
        const msgId = item?.msg_id || item?.msgId;

        const chat = chats.find((c) => c.id === chatId);


        if (chat) {
            dispatch(SelectedChat(chat));

            dispatch(SelectedMessage(msgId));
        }

        navigate("/MessagePage");
    };



    /* ---------------- DELETE ---------------- */

    const handleDeleteNotification = (id) => {
        dispatch(DeleteNotification(id));
        dispatch(DeleteNoti(id));
    }

    const truncateMessage = (message, limit = 90) => {
        if (!message) return "";
        const trimmed = message.trim();
        return trimmed.length > limit
            ? trimmed.slice(0, limit) + "..."
            : trimmed;
    };

    return (
        <div className="notification-container" style={{ ...style, ...getThemeStyle(theme) }}>
            <div className="notification-header-section">
                <div className="title" style={{ display: 'flex', alignItems: 'center' }}>
                    <span onClick={handleSidebar} style={{ cursor: 'pointer', display: 'flex' }}>
                        <MenuIcon />
                    </span>
                    <span>
                        <h2 style={{
                            margin: '0px',
                            marginLeft: '15px',
                            fontSize: '1.5rem'
                        }}>
                            Notifications
                        </h2>
                    </span>
                </div>
            </div>

            <div className="notification-list-wrapper">
                {loading && page === 1 ? (
                    <div className="notifications-grid">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="notification-card-new read">
                                <div className="notification-card-inner">
                                    <Skeleton variant="circle" width="48px" height="48px" />
                                    <div className="notification-main">
                                        <Skeleton variant="rect" width="60%" height="16px" margin="0 0 8px 0" />
                                        <Skeleton variant="rect" width="40%" height="12px" margin="0 0 4px 0" />
                                        <Skeleton variant="rect" width="90%" height="12px" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <InfiniteScroll
                        dataLength={notifications.length}
                        next={FetchMore}
                        hasMore={hasMore}
                        scrollThreshold={0.8}
                        loader={<Loader size="small" text="Loading more..." />}
                        style={{ overflow: 'hidden' }}
                    >
                        <div className="notifications-grid">
                            {Array.isArray(notifications) && notifications.length > 0 ? (

                                notifications.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`notification-card-new ${!item.seen ? "unread" : "read"}`}
                                        onClick={() => handleNotification(item)}
                                    >
                                        <div className="notification-card-inner">
                                            <div className="avatar-wrapper">
                                                <img
                                                    src={item.otheruser?.photo || profile}
                                                    alt={item.otheruser?.name}
                                                    className="notification-avatar-new"
                                                />
                                                {!item.seen && <span className="unread-dot-new"></span>}
                                            </div>

                                            <div className="notification-main">
                                                <div className="notification-info">
                                                    <h4 className="sender-name">{item.otheruser?.name || "System"}</h4>
                                                    <span className="notification-time">{item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}</span>
                                                </div>
                                                <p className="notification-title-new">{truncateMessage(item.title)}</p>
                                                <p className="notification-msg-new">{item.message}</p>
                                            </div>

                                            <div className="notification-actions">
                                                <button
                                                    className="action-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleMenu(item.id);
                                                    }}
                                                >
                                                    <MenuDotsIcon />
                                                </button>

                                                {openMenuId === item.id && (
                                                    <div className="notification-dropdown" ref={dropdownRef} style={getThemeStyle(theme)}>
                                                        <div
                                                            className="dropdown-item-new delete"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleDeleteNotification(item.id);
                                                            }}
                                                        >
                                                            <DeleteIcon color="#d93025" />
                                                            <span>Delete</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-notifications">
                                    <div className="empty-icon">🔔</div>
                                    <p>No notifications yet</p>
                                </div>
                            )}
                        </div>
                    </InfiniteScroll>
                )}
            </div>
        </div>
    );
}

