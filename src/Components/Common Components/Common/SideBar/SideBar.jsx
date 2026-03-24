import './SideBar.css'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { LogoutUser } from '../../../../Redux/Features/LogoutSlice';
import { useModal } from '../../../../Context/ModalContext';
import GlobalModal from '../../../Global Modal/GlobalModal';
import LogoutModal from '../../../Modal/LogoutModal';
import { disconnectSocket } from '../../../../Socket.io/socket';
import { closeSidebar, openSidebar } from '../../../../Redux/Features/SideBarSlice';
import { Logo, LogoutIcon, MediaIcon, MessageIcon, NotificationIcon, ProfileIcon, SerachIcon, SettingIcon, SideBarClose, SideBarOpen, StarIcon, SubscriptionIcon } from '../../Icon/Icon';
import { useContext, useEffect } from 'react';
import { BillingPortal } from '../../../../Redux/Features/subscriptions';
import { ThemeContext } from '../../../../Context/ThemeContext';

export default function Sidebar() {
    // ================================= Hook ================================= //
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isOpen = useSelector((state) => state.sidebar.isOpen);
    const { openModal, closeModal } = useModal();

    const Signup = useSelector(state => state.signup.SignupUser);
    const Signin = useSelector(state => state.signin.SigninUser);
    const user = Object.keys(Signin).length > 0 ? Signin : Signup;

    const User = useSelector(state => state.profileuser.User);

    const { type } = useSelector(state => state.subscriptions);
    const { getThemeStyle, theme, toggleTheme } = useContext(ThemeContext);


    // ================================= Function ================================= //

    const handleNavigate = (path, options) => {
        navigate(path, options);
        if (window.innerWidth <= 1024) {
            dispatch(closeSidebar());
        }
    };

    const Logout = () => {
        dispatch(LogoutUser()).unwrap();
        disconnectSocket();
        localStorage.clear();
        handleNavigate('/');
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
        if (window.innerWidth <= 1024) {
            // small screens → close sidebar
            dispatch(closeSidebar());
        } else {
            // larger screens → keep sidebar open
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

    const handleOverLay = () => {
        dispatch(closeSidebar());
    }

    return (
        // ================================= SideBar ================================= //
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
                            <li className="Sidebar-menu-1" onClick={handleMessage}>

                                <MessageIcon />

                                <span>Message</span>
                            </li>
                            <li className="Sidebar-menu-2" onClick={handleSearch}>

                                <SerachIcon />
                                <span>Search</span>
                            </li>
                            <li className="Sidebar-menu-2" onClick={handleSetting}>

                                <SettingIcon />

                                <span>Settings</span>
                            </li>
                            <li className="Sidebar-menu-3" onClick={handleNotification}>

                                <NotificationIcon />
                                <span>Notification</span>
                            </li>
                            <li className='Sidebar-menu-4' onClick={handleStarred}>

                                <StarIcon size={20} />
                                <span>Starred Message</span>
                            </li>
                            <li className='Sidebar-menu-5' onClick={handleMedia}>
                                <MediaIcon />
                                <span>Media</span>
                            </li>
                        </ul>
                        <div />
                        <ul className="Sidebar-botton-menu">
                            <li onClick={() => handleProfile(user?.id)} className="profile-menu-item">
                                <ProfileIcon />
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
            {isOpen && window.innerWidth <= 1024 && (
                <div
                    className="sidebar-overlay"
                    onClick={handleOverLay}
                />
            )
            }
        </>

    )
}