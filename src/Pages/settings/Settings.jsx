import { useContext, useEffect, useState } from "react";
import "../settings/Settings.css";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../../Redux/Features/SideBarSlice";
import { DeleteProfile } from "../../Redux/Features/DeleteProfileSlice";
import { BillingPortal, SubscriptionUserData, } from "../../Redux/Features/subscriptions";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../Context/ModalContext";
import { BillingIcon, BlockedUserIcon, ChangePasswordIcon, DeleteIcon, EditProfileIcon, MenuIcon, TranscationIcon, } from "../../Components/Common Components/Icon/Icon";
import { useLayoutStyle } from "../../Components/Common Components/Common/CommonComponents";
import GlobalModal from "../../Components/Global Modal/GlobalModal";
import DeleteAccountModal from "../../Components/Modal/DeleteAccount";
import EditeProfile from "../EditeProfile/EditeProfile";
import ChangePassword from "../ChangePassword/ChangePassword";
import Blocked from "../Blocked/BlockedPage";
import Transaction from "../Transaction/Transaction";
import { ThemeContext } from "../../Context/ThemeContext";
import { toast } from "react-toastify";

export default function Settings() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const style = useLayoutStyle();

    const sidebarOpen = useSelector((state) => state.sidebar.isOpen);
    const customerId = useSelector((state) => state.subscriptions.customerId);

    const Signup = useSelector((state) => state.signup.SignupUser);
    const Signin = useSelector((state) => state.signin.SigninUser);
    const { loading } = useSelector(state => state.subscriptions);

    const { openModal, closeModal } = useModal();

    const user = Object.keys(Signin).length > 0 ? Signin : Signup;

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const [activePage, setActivePage] = useState(
        isMobile ? null : "editProfile"
    );

    useEffect(() => {
        if (isMobile) return;
        if (!activePage) setActivePage("editProfile");
    }, [activePage, isMobile]);

    const { getThemeStyle, theme } = useContext(ThemeContext);

    const menuItems = [
        {
            key: "editProfile",
            label: "Edit Profile",
            icon: <EditProfileIcon />,
        },
        {
            key: "changePass",
            label: "Change Password",
            icon: <ChangePasswordIcon />,
        },
        {
            key: "block",
            label: "Blocked",
            icon: <BlockedUserIcon />,
        },
        {
            key: "billing",
            label: "Billing",
            icon: <BillingIcon />,
            action: "billing",
        },
        {
            key: "transcation",
            label: "Transaction",
            icon: <TranscationIcon />,
        },
    ];

    const handleMenuClick = (item) => {

        if (item.action === "billing") {
            handleBilling();
            return;
        }

        setActivePage(item.key);
    };

    const handleSidebar = () => {
        dispatch(toggleSidebar());
    };

    const handleBackToMenu = () => {
        setActivePage(null);
    };

    const deleteProfile = () => {
        if (!user) return toast.error("User not found");

        dispatch(DeleteProfile(user))
            .unwrap()
            .then(() => {
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
                navigate("/");
                toast.success("Account deleted successfully");
            })
            .catch((err) => {
                console.error(err);
                toast.error(err?.message || "Failed to delete account");
            });
    };

    const handleDeleteAccount = () => {

        openModal(
            <GlobalModal onClose={closeModal}>
                <DeleteAccountModal
                    onCancel={closeModal}
                    onConfirm={() => {
                        deleteProfile();
                        closeModal();
                    }}
                />
            </GlobalModal>
        );

    };

    const handleBilling = async () => {
        try {

            const id = customerId;

            if (!id) {
                console.error("Customer ID not found");
                toast.error('This feature is available for Premium users only');
                return;
            }

            const res = await dispatch(BillingPortal(id)).unwrap();

            if (res?.url) {
                window.location.assign(res.url);
            }

        } catch (err) {
            console.error(err);
        }
    };

    const renderPage = () => {

        switch (activePage) {

            case "editProfile":
                return <EditeProfile onBack={handleBackToMenu} type="setting" />;

            case "changePass":
                return <ChangePassword onBack={handleBackToMenu} />;

            case "block":
                return <Blocked onBack={handleBackToMenu} />;

            case "transcation":
                return <Transaction type="setting" />;

            default:
                return null;
        }
    };

    return (

        <div
            style={{ ...style, ...getThemeStyle(theme) }}
            className={`settings ${activePage && isMobile ? "show-detail" : ""
                }`}
        >

            {loading &&
                <div className="loader-overlay">
                    <div className="dots-loader">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            }
            {(!activePage || !isMobile) && (

                <div
                    className={`settings-sidebar ${sidebarOpen ? "open" : ""
                        }`}
                >

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
                                Settings
                            </h2>
                        </span>
                    </div>
                    <div className="settings-menu">
                        <ul>
                            {menuItems.map((item) => (

                                <li
                                    key={item.key}
                                    className={
                                        activePage === item.key ? "active" : ""
                                    }
                                    onClick={() => handleMenuClick(item)}
                                >
                                    {item.icon}
                                    {item.label}
                                </li>

                            ))}

                            <li
                                className="delete"
                                onClick={handleDeleteAccount}
                            >
                                <DeleteIcon color={"black"} />
                                Delete Account
                            </li>
                        </ul>
                    </div>
                </div>
            )}
            {activePage && (
                <div className="settings-detail">
                    {renderPage()}
                </div>
            )}
        </div>
    );
}
