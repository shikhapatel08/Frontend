import { useDispatch, useSelector } from "react-redux";
import { BackbtnIcon, SerachIcon } from "../Common Components/Icon/Icon";
import { SelectedChat } from "../../Redux/Features/CreateChat";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../Context/ModalContext";
import { useContext, useMemo } from "react";
import Searching from "../Modal/Seraching";
import profileImg from "../../assets/Profile/profile.svg";
import { ThemeContext } from "../../Context/ThemeContext";


export default function ChatHeader({ selectedChat, JoinUser, currentChat }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openModal, closeModal } = useModal();
  const { chats } = useSelector(state => state.createchat);
  const { getThemeStyle, theme } = useContext(ThemeContext);

  const handleBackbtn = () => {
    dispatch(SelectedChat(null));
  };

  const handleProfile = (userId) => {
    navigate(`/ProfilePage/${userId}`);
  };

  const handleSearching = () => {
    openModal(
      <Searching oncancel={closeModal} />
    )
  };

  const getChatUser = (chat, joinUserId) => {
    return chat.UserOne.id === joinUserId
      ? chat.UserTwo
      : chat.UserOne;
  };

  const liveUser = useMemo(() => {
    if (!currentChat) return null;
    return getChatUser(currentChat, JoinUser);
  }, [currentChat, JoinUser]);

  return (
    <>
      <div className="ConversationPanel-left" style={getThemeStyle(theme)}>
        <span className="back" onClick={handleBackbtn}><BackbtnIcon /></span>
        <div className="Message-Profile-img" onClick={() => handleProfile(liveUser?.id)}>
          <img src={liveUser?.photo ? liveUser?.photo : profileImg} alt='profile' />
        </div>
        <div className="Message-Username">
          <h2>{liveUser?.name}</h2>
          <p>{liveUser?.is_online ? 'online' : <span style={{ color: 'red' }}>offline</span>}</p>
        </div>
      </div>
      <div className="ConversationPanel-right">
        <div className="ConversationPanel-icon">
          {/* ================================= Seraching Message ================================= */}
          <span className="SerachIcon" onClick={handleSearching} ><SerachIcon /></span>
        </div>
      </div>
    </>
  );
}

