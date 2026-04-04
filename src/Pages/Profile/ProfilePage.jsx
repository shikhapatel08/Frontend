import React, { useContext, useEffect, useState } from "react";
import "./ProfilePage.css";
import profile from '../../assets/Profile/profile.svg'
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../Context/ModalContext";
import { UploadImg } from "../../Redux/Features/UploadImgSlice";
import { toast } from "react-toastify";
import { toggleSidebar } from "../../Redux/Features/SideBarSlice";
import MediaPage from "../Media/MediaPage";
import StarredMsg from "../Starred Msg/StarredMsg";
import DocsPage from "../Media/DocPage";
import LinkPage from "../Media/LinkPage";
import { AnotherUserProfile, ProfileUser } from "../../Redux/Features/ProfileSlice";
import {
  BackbtnIcon,
  MenuIcon,
  MessageIcon,
  NotificationIcon,
  EditIcon,
  SubscriptionIcon,
  TranscationIcon,
  SettingIcon
} from "../../Components/Common Components/Icon/Icon";
import { ThemeContext } from "../../Context/ThemeContext";
import { ProfileSkeleton } from "../../Components/Common Components/Loader/PageSkeletons";
import { useLayoutStyle } from "../../Components/Common Components/Common/CommonComponents";



export default function ProfilePage({ onBack, type }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const style = useLayoutStyle();
  const { closeModal } = useModal();

  const { loading: uploadLoading } = useSelector(state => state.uploading);
  const { User, AnotherUser, loading: profileLoading } = useSelector(state => state.profileuser);

  const { selectedChat } = useSelector(state => state.createchat);

  const Signup = useSelector(state => state.signup.SignupUser);
  const Signin = useSelector(state => state.signin.SigninUser);

  const [avatarPreview, setAvatarPreview] = useState(User?.photo || profile);
  const [avatarFile, setAvatarFile] = useState(null);
  const [activeTab, setActiveTab] = useState('media');
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024);
  const { theme, getThemeStyle } = useContext(ThemeContext);

  const user = Object.keys(Signin).length > 0 ? Signin : Signup;

  const location = useLocation();

  const from = location.state?.from;
  const userId = location.state?.userId;

  const isOwnProfile = from === "Sidebar";

  useEffect(() => {
    if (from === 'Sidebar') {
      dispatch(ProfileUser());
    } else {
      dispatch(AnotherUserProfile(userId));
    }
  }, [from]);

  useEffect(() => {
    if (User?.photo) {
      setAvatarPreview(User.photo);
    }
  }, [User]);

  useEffect(() => {
    const onResize = () => setIsTablet(window.innerWidth <= 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (avatarPreview && avatarPreview !== profile) URL.revokeObjectURL(avatarPreview);
      setAvatarPreview(URL.createObjectURL(file));
      setAvatarFile(file);
    }
  };

  const handleUpload = async () => {
    if (!avatarFile) return toast.error("Please select a photo");

    const formData = new FormData();
    formData.append("profile", avatarFile);

    try {
      await dispatch(UploadImg(formData)).unwrap();
      toast.success("Profile Photo updated successfully");
      setAvatarFile(null);
      closeModal();
    } catch {
      toast.error("Failed to upload photo");
    }
  };

  const navigateTo = (path) => navigate(path);

  const handleHamburgerIcon = () => {
    dispatch(toggleSidebar())
  }

  const openFilePicker = () => {
    if (isOwnProfile) {
      document.getElementById('fileInput').click()
    }
  }

  const tabs = [
    { key: "media", label: "Media" },
    { key: "docs", label: "Docs" },
    { key: "links", label: "Links" },
    { key: "starred", label: "Starred" },
  ];

  const Data = isOwnProfile ? User : AnotherUser;

  return (
    <div className="profile-container" style={{ ...(type === 'setting' ? {} : style), ...getThemeStyle(theme) }}>
      {profileLoading && Object.keys(Data).length === 0 ? (
        <ProfileSkeleton />
      ) : (
        <>
          <span className="back-btn" onClick={onBack}><BackbtnIcon /></span>
          <div className="profile-header">
            <div className="cover">
              {type === 'setting' && isTablet ? (
                <span className="back-btn" onClick={onBack}><BackbtnIcon /></span>
              ) : (
                <span className="hamburger-icon" onClick={handleHamburgerIcon}><MenuIcon /></span>
              )}

              <div className="profile-image-wrapper">
                <img
                  src={
                    isOwnProfile && avatarPreview
                      ? avatarPreview
                      : Data?.photo || profile
                  }
                  alt="profile"
                  className="profile-image"
                  onClick={openFilePicker}
                />
                <input
                  type="file"
                  id="fileInput"
                  hidden
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>
          </div>

          <div className="profileInfo">
            <h2>{Data?.name}</h2>
            <p>{Data?.email}</p>
          </div>

          {isOwnProfile && (
            <>
              <div className="profile-buttons">
                {avatarFile && (
                  <button className="btn upload" onClick={handleUpload} disabled={uploadLoading}>
                    {uploadLoading ? "Uploading..." : "Upload Photo"}
                  </button>
                )}

              </div>
              <div className="bottom-section">
                <div className="feature-card" onClick={() => navigateTo('/MessagePage')}>
                  <div className="card-icon-wrapper">
                    <MessageIcon />
                  </div>
                  <div className="card-content">
                    <h3>Chat</h3>
                    <p>Connect with your friends instantly.</p>
                  </div>
                </div>

                <div className="feature-card" onClick={() => navigateTo("/notification")}>
                  <div className="card-icon-wrapper">
                    <NotificationIcon />
                  </div>
                  <div className="card-content">
                    <h3>Notifications</h3>
                    <p>Get real time alerts and updates.</p>
                  </div>
                </div>

                <div className="feature-card" onClick={() => navigateTo("/editeprofile")}>
                  <div className="card-icon-wrapper">
                    <EditIcon />
                  </div>
                  <div className="card-content">
                    <h3>Edit Profile</h3>
                    <p>Manage your profile information.</p>
                  </div>
                </div>

                <div className="feature-card" onClick={() => navigateTo("/subscriptions")}>
                  <div className="card-icon-wrapper">
                    <SubscriptionIcon />
                  </div>
                  <div className="card-content">
                    <h3>Subscription</h3>
                    <p>Manage your plan and features.</p>
                  </div>
                </div>

                <div className="feature-card" onClick={() => navigateTo("/transaction")}>
                  <div className="card-icon-wrapper">
                    <TranscationIcon />
                  </div>
                  <div className="card-content">
                    <h3>Transaction</h3>
                    <p>See your payment history.</p>
                  </div>
                </div>

                <div className="feature-card">
                  <div className="card-icon-wrapper">
                    <SettingIcon />
                  </div>
                  <div className="card-content">
                    <h3>Security</h3>
                    <p>Your data is protected with encryption.</p>
                  </div>
                </div>
              </div>

            </>
          )}

          {!isOwnProfile && (
            <>
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

                {activeTab === "media" && (
                  <MediaPage chatId={selectedChat?.id} />
                )}

                {activeTab === "docs" && (
                  <DocsPage chatId={selectedChat?.id} />
                )}

                {activeTab === "links" && (
                  <LinkPage chatId={selectedChat?.id} />
                )}

                {activeTab === "starred" && (
                  <StarredMsg
                    type="Chat"
                    chatId={selectedChat?.id}
                  />
                )}

              </div>
            </>
          )}

        </>
      )}
    </div>
  );
};
