import profile from '../../assets/Profile/profile.svg';
import '../Blocked/BlockedPage.css';
import { useDispatch, useSelector } from "react-redux";
import { BlockedUser } from "../../Redux/Features/BlockedSlice";
import { toast } from "react-toastify";
import { useModal } from "../../Context/ModalContext";
import GlobalModal from "../../Components/Global Modal/GlobalModal";
import { BackbtnIcon } from '../../Components/Common Components/Icon/Icon';
import { useContext } from 'react';
import { ThemeContext } from '../../Context/ThemeContext';
import BlockedChatModal from '../../Components/Modal/BlockedUser';

export default function Blocked({ onBack }) {

    const dispatch = useDispatch();
    const { chats } = useSelector(state => state.createchat);
    const { openModal, closeModal } = useModal();
    const Signup = useSelector(state => state.signup.SignupUser);
    const Signin = useSelector(state => state.signin.SigninUser);
    const { getThemeStyle, theme } = useContext(ThemeContext);
    const { loading } = useSelector(state => state.blocked);

    const user = Object.keys(Signin).length > 0 ? Signin : Signup;
    const JoinUser = user?.id;

    // ---------------- GET OTHER USER ----------------
    const getOtherUser = (chat, joinUserId) => {
        return chat.UserOne.id === joinUserId ? chat.UserTwo : chat.UserOne;
    };

    // ---------------- BLOCKED USERS LIST ----------------

    const blockedChats = chats
        .filter(chat => chat.is_block)
        .map(chat => ({
            ...getOtherUser(chat, JoinUser),
            chatId: chat.id,
        }));

    // ---------------- UNBLOCK HANDLER ----------------

    const Unblocked = async (user) => {
        await dispatch(BlockedUser(user.chatId))
        toast.success("User unblocked!");
    };

    const handleUnblock = (user) => {
        openModal(
            <GlobalModal onClose={closeModal}>
                <BlockedChatModal
                    onCancel={closeModal}
                    isBlocked={true}
                    onConfirm={() => {
                        Unblocked(user);
                        closeModal();
                    }}
                    loading={loading}
                />
            </GlobalModal>
        );
    };


    return (
        <div className="bolcked-container" style={getThemeStyle(theme)}>

            <div>
                <span className='back-btn' onClick={onBack}><BackbtnIcon /></span>
                <span><h2>Blocked accounts</h2></span>
            </div>

            <div className="blocked-account">
                <p>You can block people anytime from their profiles.</p>

                {blockedChats.length > 0 ? (
                    blockedChats.map(user => (

                        <div className="blocked-users" key={user.id}>
                            <img src={user.photo ? user.photo : profile} alt="profile" />
                            <span>{user.name}</span>
                            <button onClick={() => handleUnblock(user)}>
                                Unblock
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No Blocked User</p>
                )}
            </div>
        </div>
    )
}
