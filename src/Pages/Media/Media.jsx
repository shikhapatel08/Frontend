import { useNavigate } from "react-router-dom"
import '../Media/Media.css'
import { useDispatch } from "react-redux";
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
                        Media
                    </h2>
                </span>
            </div>

            <span onClick={handleBackbtn} className="back-btn"><BackbtnIcon /></span>

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
                {activeTab === "media" && <MediaPage type="all" />}
                {activeTab === "docs" && <DocsPage type='all' />}
                {activeTab === "links" && <LinkPage type='all' />}
            </div>

        </div>
    )
}
