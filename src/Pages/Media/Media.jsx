import { useNavigate } from "react-router-dom"
import '../Media/Media.css'
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../../Redux/Features/SideBarSlice";
import { useContext, useState } from "react";
import MediaPage from "./MediaPage";
import DocsPage from "./DocPage";
import LinkPage from "./LinkPage";
import { useLayoutStyle } from "../../Components/Common Components/Common/CommonComponents";
import { BackbtnIcon, MenuIcon } from "../../Components/Common Components/Icon/Icon";
import { ThemeContext } from "../../Context/ThemeContext";

export default function Media() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('media');
    const style = useLayoutStyle();
    const { theme, getThemeStyle } = useContext(ThemeContext);
    const { chats } = useSelector(state => state.createchat);

    const tabs = [
        { key: "media", label: "Media" },
        { key: "docs", label: "Docs" },
        { key: "links", label: "Links" }
    ];

    const handleBackbtn = () => {
        navigate(-1);
    };

    const handleHamburgerIcon = () => {
        dispatch(toggleSidebar())
    };

    return (
        <div className="Media" style={{ ...style, ...getThemeStyle(theme) }}>
            <div className="title">
                <span><h2 style={{ marginLeft: '30px' }}>Media</h2></span>
            </div>

            <span onClick={handleBackbtn} className="back-btn"><BackbtnIcon /></span>
            <span onClick={handleHamburgerIcon}><MenuIcon /></span>

            <div className="tabs">
                {tabs.map((tab) => (
                    <span
                        key={tab.key}
                        className={activeTab === tab.key ? "active" : ""}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.label}
                    </span>
                ))}
            </div>

            <div className="tab-content">
                {activeTab === "media" && <MediaPage type="all" chatId={chats?.id} />}
                {activeTab === "docs" && <DocsPage type='all' chatId={chats?.id}/>}
                {activeTab === "links" && <LinkPage type='all' chatId={chats?.id} />}
            </div>

        </div>
    )
}