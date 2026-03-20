import { useContext, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AddNotification, DeleteNoti, DeleteNotification, FetchNotifications, SeenNotification } from "../../Redux/Features/NotificationSlice"
import '../Notification/Notification.css'
import { useNavigate } from "react-router-dom";
import { SelectedMessage } from "../../Redux/Features/SearchMsgSlice";
import { useLayoutStyle } from "../../Components/Common Components/Common/CommonComponents";
import { BackbtnIcon, DeleteIcon, MenuDotsIcon, MenuIcon } from "../../Components/Common Components/Icon/Icon";
import { toggleSidebar } from "../../Redux/Features/SideBarSlice";
import { Delete } from "../../Redux/Features/DeleteSlice";
import { SelectedChat } from "../../Redux/Features/CreateChat";
import profile from "../../assets/Profile/profile.svg";
import InfiniteScroll from 'react-infinite-scroll-component';
import { ThemeContext } from "../../Context/ThemeContext";

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
        dispatch(FetchNotifications({ page: 1 }))
    }, []);

    /* ---------------- NAVIGATION ---------------- */

    const handleBackbtn = () => {
        navigate(-1);
    }

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

    // 

    const handleNotification = (item) => {
        dispatch(SeenNotification(item.id));

        const chat = chats.find((c) => c.id === item.Chat.id);

        if (chat) dispatch(SelectedChat(chat));

        dispatch(SelectedMessage(item.id));

        navigate("/MessagePage");
    };

    /* ---------------- DELETE ---------------- */

    const handleDeleteNotification = (id) => {
        dispatch(DeleteNotification(id));
        dispatch(DeleteNoti(id));
    }

    return (
        <div className="notification-container" style={{...style,...getThemeStyle(theme)}}>
            <div className="title">
                <span><h2>Notification</h2></span>
            </div>
            <span onClick={handleBackbtn} className="back-btn"><BackbtnIcon /></span>
            <span onClick={handleSidebar}><MenuIcon /></span>
            <InfiniteScroll
                dataLength={notifications.length}
                next={FetchMore}
                hasMore={hasMore}
                // scrollableTarget="scrollableDiv"
                scrollThreshold={0.8}
                style={{ display: 'flex', flexDirection: 'column' }}
            >
                <div>
                    {loading ? (
                        <div className="loader-conatainer">
                            <div className="loader"></div>
                        </div>
                    ) : (<>
                        {Array.isArray(notifications) && notifications.length > 0 ?
                            (notifications.map((item) => (
                                <div
                                    key={item.id}
                                    className={item.seen ? "notification-card" : "notification-highlight"}
                                    onClick={() => {
                                        handleNotification(item);
                                    }}
                                >
                                    <img
                                        src={item.otheruser?.photo ? item.otheruser?.photo : profile}
                                        alt={item.otheruser?.name}
                                        className="notification-avatar"
                                    />

                                    <div className="notification-content">
                                        <div className="notification-top">
                                            {/* <h4 >{item.otheruser.name}</h4> */}
                                            {!item.seen && <span className="dot"></span>}
                                        </div>

                                        <p className="notification-title"><b>{item.title}</b></p>
                                        <p className="notification-message">{item.message}</p>
                                    </div>
                                    <span style={{ marginTop: '17px' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleMenu(item.id);
                                        }}
                                    ><MenuDotsIcon /></span>
                                    {openMenuId === item.id &&
                                        <div className="Dropdown-Menu" ref={dropdownRef}>
                                            <div className="Dropdown-Item"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleDeleteNotification(item.id)
                                                }}
                                                style={{ color: 'red' }}
                                            >
                                                <DeleteIcon color={'red'} />
                                                Delete
                                            </div>
                                        </div>
                                    }
                                </div>
                            ))) : (
                                <>
                                    <p className="no-notification">No Notifications Found</p>
                                </>
                            )
                        }
                    </>)}
                </div>
            </InfiniteScroll>
        </div>
    )
}