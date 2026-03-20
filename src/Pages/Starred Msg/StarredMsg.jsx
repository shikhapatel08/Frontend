import { useNavigate } from "react-router-dom";
import { toggleSidebar } from "../../Redux/Features/SideBarSlice";
import "../Starred Msg/StarredMsg.css";

import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect } from "react";

import { GetStarredMsg, StarredMsgChat } from "../../Redux/Features/StarredMsg";
import { SelectedMessage } from "../../Redux/Features/SearchMsgSlice";
import { SelectedChat } from "../../Redux/Features/CreateChat";

import { useLayoutStyle } from "../../Components/Common Components/Common/CommonComponents";
import { BackbtnIcon, MenuIcon } from "../../Components/Common Components/Icon/Icon";

import profile from "../../assets/Profile/profile.svg";
import InfiniteScroll from "react-infinite-scroll-component";
import { ThemeContext } from "../../Context/ThemeContext";

export default function StarredMsg({ type, chatId }) {

    /* ---------------- HOOKS ---------------- */

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const style = useLayoutStyle();

    const { starredMessages, loading, page, hasMore } = useSelector((state) => state.starredMsg);
    const { chats } = useSelector((state) => state.createchat);

    const { theme, getThemeStyle } = useContext(ThemeContext);

    const isChatView = type === "Chat";

    /* ---------------- FETCH DATA ---------------- */

    useEffect(() => {

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

    const handleStarredMsg = (msg) => {

        const chatId = msg.setting?.[0]?.chat_id;

        const chatInStore = chats.find(
            (chat) => chat.id === chatId
        );

        if (chatInStore) {
            dispatch(SelectedChat(chatInStore));
        }

        dispatch(SelectedMessage(msg.id));
        navigate("/MessagePage");
    };

    /* ---------------- NAVIGATION ---------------- */

    const handleBack = () => navigate(-1);

    const handleSidebar = () => dispatch(toggleSidebar());

    /* ---------------- UI ---------------- */

    return (

        <div
            className={isChatView ? "Starred-msg" : "StarredMsg"}
            style={{ ...(isChatView ? {} : style), ...getThemeStyle(theme) }}
        >

            {/* HEADER */}

            <div className={isChatView ? "Starred" : "Statted-title"}>

                <div className="title">
                    <h2>Starred</h2>
                </div>

                <span
                    onClick={handleBack}
                    className="back-btn"
                >
                    <BackbtnIcon />
                </span>

                <span onClick={handleSidebar}>
                    <MenuIcon />
                </span>

            </div>

            {/* CONTENT */}

            {loading && starredMessages.length === 0 ? (

                <div className="loader-conatainer">
                    <div className="loader"></div>
                </div>

            ) : starredMessages.length === 0 ? (

                <p className="no-link">
                    No Starred Message
                </p>

            ) : (

                <InfiniteScroll
                    dataLength={starredMessages.length}
                    next={fetchMore}
                    hasMore={hasMore}
                    scrollThreshold={0.8}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >

                    <div className="starred-list">

                        {starredMessages.map((msg) => (

                            <div
                                key={msg.id}
                                className="starred-item"
                                onClick={() =>
                                    handleStarredMsg(msg)
                                }
                            >

                                <img
                                    src={
                                        msg.sender?.photo || profile
                                    }
                                    alt={msg.sender?.name}
                                    className="starred-user-img"
                                />

                                <div className="starred-content">

                                    <h4>{msg.sender?.name}</h4>

                                    <p>
                                        {msg.text ||
                                            "📷 Media message"}
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>

                </InfiniteScroll>

            )}

        </div>

    );

}