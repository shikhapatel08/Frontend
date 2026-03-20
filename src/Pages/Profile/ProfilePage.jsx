import React, { useContext, useEffect, useState } from "react";
import "./ProfilePage.css";
import profile from '../../assets/Profile/profile.svg'
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DeleteProfile } from "../../Redux/Features/DeleteProfileSlice";
import { useModal } from "../../Context/ModalContext";
import GlobalModal from "../../Components/Global Modal/GlobalModal";
import ProfilePicUpdate from "../../Components/Modal/ProfilePicUpdate";
import { UploadImg } from "../../Redux/Features/UploadImgSlice";
import { toast } from "react-toastify";
import { toggleSidebar } from "../../Redux/Features/SideBarSlice";
import MediaPage from "../Media/MediaPage";
import StarredMsg from "../Starred Msg/StarredMsg";
import DocsPage from "../Media/DocPage";
import LinkPage from "../Media/LinkPage";
import { ProfileUser } from "../../Redux/Features/ProfileSlice";
import { BackbtnIcon, MenuIcon } from "../../Components/Common Components/Icon/Icon";
import { useLayoutStyle } from "../../Components/Common Components/Common/CommonComponents";
import { SelectedChat } from "../../Redux/Features/CreateChat";
import { ThemeContext } from "../../Context/ThemeContext";

export default function ProfilePage({ onBack, type }) {
  // const userId = useSelector(state => state.alluser.User?.id);
  // const navigate = useNavigate();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const style = useLayoutStyle();
  const { closeModal } = useModal();

  const { loading } = useSelector(state => state.uploading);
  const User = useSelector(state => state.profileuser.User);
  const { selectedChat , chats } = useSelector(state => state.createchat);

  const Signup = useSelector(state => state.signup.SignupUser);
  const Signin = useSelector(state => state.signin.SigninUser);

  const [avatarPreview, setAvatarPreview] = useState(User?.photo || profile);
  const [avatarFile, setAvatarFile] = useState(null);
  const [activeTab, setActiveTab] = useState('media');
  const { theme, getThemeStyle } = useContext(ThemeContext);

  const user = Object.keys(Signin).length > 0 ? Signin : Signup;
  const isOwnProfile = String(user?.id) === String(id);

  /* ---------------- FETCH PROFILE ---------------- */

  useEffect(() => {
    if (id) {
      dispatch(ProfileUser(id));
    }
  }, [id]);

  useEffect(() => {
    if (User?.photo) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAvatarPreview(User.photo);
    }
  }, [User]);

  /* ---------------- FILE SELECT ---------------- */

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (avatarPreview && avatarPreview !== profile) URL.revokeObjectURL(avatarPreview);
      setAvatarPreview(URL.createObjectURL(file));
      setAvatarFile(file);
    }
  };

  /* ---------------- UPLOAD PHOTO ---------------- */

  const handleUpload = async () => {
    if (!avatarFile) return toast.error("Please select a photo");

    const formData = new FormData();
    formData.append("profile", avatarFile);

    try {
      await dispatch(UploadImg(formData)).unwrap();
      toast.success("Profile Photo updated successfully");
      closeModal();
    } catch {
      toast.error("Failed to upload photo");
    }
  };

  /* ---------------- NAVIGATION ---------------- */

  const navigateTo = (path) => navigate(path);

  const handleHamburgerIcon = () => {
    dispatch(toggleSidebar())
  }

  const openFilePicker = () => {
    if (isOwnProfile) {
      document.getElementById('fileInput').click()
    }
  }

  /* ---------------- TABS ---------------- */

  const tabs = [
    { key: "media", label: "Media" },
    { key: "docs", label: "Docs" },
    { key: "links", label: "Links" },
    { key: "starred", label: "Starred" },
  ];

  return (
    <div className="profile-container" style={{ ...(type === 'setting' ? {} : style), ...getThemeStyle(theme) }}>
      {user.length === 0 ? (
        <div className='loader-conatainer'>
          <div className="loader"></div>
        </div>
      ) : (
        <>
          <span className="back-btn" onClick={onBack}><BackbtnIcon /></span>
          <div className="profile-header">
            <div className="cover">
              {type === 'setting' && window.innerWidth <= 1024 ? (
                <span onClick={onBack} style={{ marginRight: '600px' }}><BackbtnIcon /></span>
              ) : (
                <span onClick={handleHamburgerIcon}><MenuIcon /></span>
              )}
            </div>



            <div className="profile-image-wrapper">
              {/* ================================= Click on image to open file selector ================================= */}
              <img
                src={avatarPreview && user?.id === User?.id // show preview only for self
                  ? avatarPreview
                  : User?.photo || profile}
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

          <div className="profile-info">
            <h2>{User?.name}</h2>
            <p>{User?.email}</p>
          </div>

          {isOwnProfile && (
            <>
              <div className="profile-buttons">
                {/* <button className="btn edit" onClick={handleEditProfile}>Edit Profile</button>
          <button className="btn del" onClick={handelDeleteProfile}>Delete Profile</button> */}
                {avatarFile && (
                  <button className="btn upload" onClick={handleUpload} disabled={loading}>
                    {loading ? "Uploading..." : "Upload Photo"}
                  </button>
                )}
              </div>
              <div className="bottom-section" style={getThemeStyle(theme)}>
                <div className="box" onClick={() => navigateTo('/MessagePage')}>
                  <h3>Chat</h3>
                  <p>Connect with your friends instantly.</p>
                </div>

                <div className="box" onClick={() => navigateTo("/notification")}>
                  <h3>Notifications</h3>
                  <p>Get real time alerts and updates.</p>
                </div>

                <div className="box" onClick={() => navigateTo("/editeprofile")}>
                  <h3>Edit Profile</h3>
                  <p>Manage your profile information.</p>
                </div>

                <div className="box" onClick={() => navigateTo("/subscriptions")}>
                  <h3>Subscription</h3>
                  <p>Manage your subscription plan and features.</p>
                </div>

                <div className="box" onClick={() => navigateTo("/transaction")}>
                  <h3>Transaction</h3>
                  <p>See your Transactions.</p>
                </div>

                <div className="box">
                  <h3>Security</h3>
                  <p>Your data is protected with encryption.</p>
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
                  <MediaPage chatId={User?.id} />
                )}

                {activeTab === "docs" && (
                  <DocsPage chatId={User?.id} />
                )}

                {activeTab === "links" && (
                  <LinkPage chatId={User?.id} />
                )}

                {activeTab === "starred" && (
                  <StarredMsg
                    type="Chat"
                    chatId={User?.id}
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
