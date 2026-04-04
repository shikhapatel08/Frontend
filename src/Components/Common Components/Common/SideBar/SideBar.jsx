import './SideBar.css'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { LogoutUser } from '../../../../Redux/Features/LogoutSlice';
import { useModal } from '../../../../Context/ModalContext';
import GlobalModal from '../../../Global Modal/GlobalModal';
import LogoutModal from '../../../Modal/LogoutModal';
import { disconnectSocket } from '../../../../Socket.io/socket';
import { closeSidebar, openSidebar } from '../../../../Redux/Features/SideBarSlice';
import { Logo, LogoutIcon, MediaIcon, MessageIcon, NotificationIcon, ProfileIcon, SerachIcon, SettingIcon, SideBarClose, SideBarOpen, StarIcon, SubscriptionIcon } from '../../Icon/Icon';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../../../Context/ThemeContext';
import { SelectedChat } from '../../../../Redux/Features/CreateChat';
import profile from "../../../../assets/Profile/profile.svg";

export default function Sidebar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const isOpen = useSelector((state) => state.sidebar.isOpen);

    const isActive = (path) => location.pathname === path;
    const { openModal, closeModal } = useModal();

    const Signup = useSelector(state => state.signup.SignupUser);
    const Signin = useSelector(state => state.signin.SigninUser);
    const user = Object.keys(Signin).length > 0 ? Signin : Signup;

    const User = useSelector(state => state.profileuser.User);

    const { type } = useSelector(state => state.subscriptions);
    const { getThemeStyle, theme, toggleTheme } = useContext(ThemeContext);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

    const handleNavigate = (path, options) => {
        navigate(path, options);
        if (isMobile) {
            dispatch(closeSidebar());
        }
    };

    const clearSessionData = () => {
        [
            "token",
            "selectedChat",
            "SigninUser",
            "SignupUser",
            "User",
            "AllUser",
            "customerId",
            "subscriptionType",
            "otpVerified",
            "PinnedMsg",
        ].forEach((key) => localStorage.removeItem(key));
    };

    const Logout = () => {
        dispatch(LogoutUser()).unwrap();
        disconnectSocket();
        clearSessionData();
        handleNavigate('/');
        dispatch(SelectedChat(null));
    }

    const handleLogout = () => {
        openModal(
            <GlobalModal onClose={closeModal}>
                <LogoutModal
                    onCancel={closeModal}
                    onConfirm={async () => {
                        await Logout();
                        closeModal();
                    }}
                />
            </GlobalModal>
        );
    };

    const handleProfile = (userId) => {
        handleNavigate(`/ProfilePage`, { state: { from: 'Sidebar' } });
    };

    const handleResize = () => {
        const nextIsMobile = window.innerWidth <= 1024;
        setIsMobile(nextIsMobile);

        if (nextIsMobile) {
            dispatch(closeSidebar());
        } else {
            dispatch(openSidebar());
        }
    };

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const handleLogo = () => {
        handleNavigate('/MessagePage');
    }

    const handleToggleIcon = () => {
        isOpen ? dispatch(closeSidebar()) : dispatch(openSidebar())
    }

    const handleMessage = () => {
        handleNavigate('/MessagePage');
    }

    const handleSearch = () => {
        handleNavigate('/Search');
    }

    const handleSetting = () => {
        handleNavigate('/Settings');
    }
    const handleNotification = () => {
        handleNavigate('/notification');
    }
    const handleStarred = () => {
        handleNavigate('/StarredMsg');
    }
    const handleMedia = () => {
        handleNavigate('/Media');
    }

    const handleSubscription = () => {
        handleNavigate('/subscriptions');
    }

    const handleOverLay = () => {
        dispatch(closeSidebar());
    }

    return (
        <>
            <div className={`Sidebar-container ${isOpen ? "open" : "collapsed"}`} style={getThemeStyle(theme)}>
                <div className="Sidebar-logo" >
                    <span onClick={handleLogo}>
                        <Logo />
                    </span>
                    <span
                        className="toggle-icon"
                        onClick={handleToggleIcon} >
                        {isOpen ? <SideBarClose /> : <SideBarOpen />}
                    </span>
                </div>
                <div className="Sidebar-menu">
                    <div className="Sidebar-sections">
                        <ul className="Sidebar-top-menu">
                            <li className={isActive('/MessagePage') ? 'active' : ''} onClick={handleMessage}>
                                <MessageIcon />
                                <span>Messages</span>
                            </li>
                            <li className={isActive('/Search') ? 'active' : ''} onClick={handleSearch}>
                                <SerachIcon />
                                <span>Search</span>
                            </li>
                            <li className={isActive('/Settings') ? 'active' : ''} onClick={handleSetting}>
                                <SettingIcon />
                                <span>Settings</span>
                            </li>
                            <li className={isActive('/notification') ? 'active' : ''} onClick={handleNotification}>
                                <NotificationIcon />
                                <span>Notifications</span>
                            </li>
                            <li className={isActive('/StarredMsg') ? 'active' : ''} onClick={handleStarred}>
                                <StarIcon size={20} color={'currentColor'} />
                                <span>Starred</span>
                            </li>
                            <li className={isActive('/Media') ? 'active' : ''} onClick={handleMedia}>
                                <MediaIcon />
                                <span>Media</span>
                            </li>
                            <li className={isActive('/Subscription') ? 'active' : ''} onClick={handleSubscription}>
                                <SubscriptionIcon />
                                <span>Subscription</span>
                            </li>
                        </ul>
                        <div />
                        <ul className="Sidebar-botton-menu">
                            <li onClick={() => handleProfile(user?.id)} className="profile-menu-item">
                                <img className="profileImg" src={User?.photo ? User?.photo : profile} alt="" />
                                <div className="profile-text">
                                    <span>{User?.name}</span>
                                    <p>{type}</p>
                                </div>
                            </li>
                            <li>
                                <div className="form-check form-switch mb-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="flexSwitchCheckChecked"
                                        checked={theme === "dark"}
                                        onChange={toggleTheme}
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="flexSwitchCheckChecked"
                                    >
                                        Mode
                                    </label>
                                </div>
                            </li>
                            <li onClick={handleLogout}>
                                <LogoutIcon />
                                <span>Logout</span>
                            </li>
                        </ul>

                    </div>
                </div>
            </div >
            {isOpen && isMobile && (
                <div
                    className="sidebar-overlay"
                    onClick={handleOverLay}
                />
            )
            }
        </>

    )
}
