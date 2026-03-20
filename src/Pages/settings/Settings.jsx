import { useContext, useState } from "react";
import "../settings/Settings.css";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../../Redux/Features/SideBarSlice";
import { DeleteProfile } from "../../Redux/Features/DeleteProfileSlice";
import { BillingPortal, SubscriptionUserData, } from "../../Redux/Features/subscriptions";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../Context/ModalContext";
import { BackbtnIcon, BillingIcon, BlockedUserIcon, ChangePasswordIcon, DeleteIcon, EditProfileIcon, MenuIcon, TranscationIcon, } from "../../Components/Common Components/Icon/Icon";
import { useLayoutStyle } from "../../Components/Common Components/Common/CommonComponents";
import GlobalModal from "../../Components/Global Modal/GlobalModal";
import DeleteAccountModal from "../../Components/Modal/DeleteAccount";
import EditeProfile from "../EditeProfile/EditeProfile";
import ChangePassword from "../ChangePassword/ChangePassword";
import Blocked from "../Blocked/BlockedPage";
import Transaction from "../Transaction/Transaction";
import { ThemeContext } from "../../Context/ThemeContext";

export default function Settings() {

    /* ---------------- HOOKS ---------------- */

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const style = useLayoutStyle();

    const sidebarOpen = useSelector((state) => state.sidebar.isOpen);
    const customerId = useSelector((state) => state.subscriptions.customerId);

    const Signup = useSelector((state) => state.signup.SignupUser);
    const Signin = useSelector((state) => state.signin.SigninUser);
    const { loading } = useSelector(state => state.subscriptions);

    const user = Object.keys(Signin).length ? Signin : Signup;

    const { openModal, closeModal } = useModal();

    const isMobile = window.innerWidth < 768;

    const [activePage, setActivePage] = useState(
        isMobile ? null : "editProfile"
    );

    const { getThemeStyle, theme } = useContext(ThemeContext);

    /* ---------------- MENU CONFIG ---------------- */

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

    /* ---------------- MENU CLICK ---------------- */

    const handleMenuClick = (item) => {

        if (item.action === "billing") {
            handleBilling();
            return;
        }

        setActivePage(item.key);
    };

    /* ---------------- SIDEBAR ---------------- */

    const handleSidebar = () => {
        dispatch(toggleSidebar());
    };

    /* ---------------- BACK BUTTON ---------------- */

    const handleBack = () => {
        navigate(-1);
    };

    const handleBackToMenu = () => {
        setActivePage(null);
    };

    /* ---------------- DELETE ACCOUNT ---------------- */

    const deleteProfile = () => {
        dispatch(DeleteProfile(user));
        localStorage.clear();
        navigate("/");
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

    /* ---------------- BILLING ---------------- */

    const handleBilling = async () => {
        try {
            const subData = await dispatch(
                SubscriptionUserData()
            ).unwrap();
            const id = subData?.customerId || customerId;
            const res = await dispatch(
                BillingPortal(id)
            ).unwrap();
            if (res?.url) {
                window.location.assign(res.url);
            }

        } catch (err) {
            console.error(err);
        }
    };

    /* ---------------- PAGE RENDER ---------------- */

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

    /* ---------------- UI ---------------- */

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

            {/* SIDEBAR */}

            {(!activePage || !isMobile) && (

                <div
                    className={`settings-sidebar ${sidebarOpen ? "open" : ""
                        }`}
                >

                    <div className="title">
                        <h2 style={{ marginTop: 13, marginLeft: 24 }}>
                            Settings
                        </h2>
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