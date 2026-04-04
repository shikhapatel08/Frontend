import React, { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forwardMessage } from '../../Redux/Features/SendMessage';
import { toast } from 'react-toastify';
import profile from "../../assets/Profile/profile.svg";
import './ForwardModal.css'
import { ThemeContext } from '../../Context/ThemeContext';


export default function ForwardModal({ msgId, onClose }) {
    const dispatch = useDispatch();

    const { chats } = useSelector((state) => state.createchat);
    const Signup = useSelector(state => state.signup.SignupUser);
    const Signin = useSelector(state => state.signin.SigninUser);
    const currentUser = Object.keys(Signin).length > 0 ? Signin : Signup;

    const [selectedChatIds, setSelectedChatIds] = useState([]);
    const [loading, setLoading] = useState(false);

    const { getThemeStyle, theme } = useContext(ThemeContext);


    const toggleChatSelection = (chatId) => {
        if (selectedChatIds.includes(chatId)) {
            setSelectedChatIds(prev => prev.filter(id => id !== chatId));
        } else {
            if (selectedChatIds.length >= 5) {
                toast.warning("You can forward to a maximum of 5 chats");
                return;
            }
            setSelectedChatIds(prev => [...prev, chatId]);
        }
    };

    const handleForward = async () => {
        if (selectedChatIds.length === 0) return;
        setLoading(true);

        try {
            const result = await dispatch(forwardMessage({
                msgId,
                chatIds: selectedChatIds
            })).unwrap();

            if (result.forwarded?.length > 0) {
                toast.success(`${result.forwarded.length} messages forwarded!`);
            }

            if (result.failed?.length > 0) {
                result.failed.forEach(f => {
                    toast.error(`Failed: ${f.reason}`);
                });
            }

            onClose();
        } catch (error) {
            toast.error(error?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forward-modal" style={getThemeStyle(theme)}>
            <div className="modal-header">
                <h3>Forward to</h3>
                <span className="count-badge">{selectedChatIds.length}/5 selected</span>
            </div>

            <div className="chat-list">
                {chats && chats.length > 0 ? (
                    chats.map((chat) => {
                        const otherUser = chat.UserOne?.id === currentUser?.id
                            ? chat.UserTwo
                            : chat.UserOne;

                        const isSelected = selectedChatIds.includes(chat.id);
                        const isDisable = selectedChatIds.length >= 5 && !isSelected;

                        return (
                            <div
                                key={chat.id}
                                className={`userItem ${isDisable ? "disabled-item" : ""} ${isSelected ? "selected-item" : ""}`}
                                onClick={() => !isDisable && toggleChatSelection(chat.id)}
                            >
                                <div className="userInfo">
                                    <img src={otherUser?.photo || profile} alt="profile" />
                                    <div>
                                        <h4>{otherUser?.name || "Unknown User"}</h4>
                                    </div>
                                </div>

                                <input
                                    type="checkbox"
                                    className="custom-checkbox"
                                    checked={isSelected}
                                    disabled={isDisable}
                                    readOnly
                                />
                            </div>
                        );
                    })
                ) : (
                    <div className="no-chats">No active chats found.</div>
                )}
            </div>

            <div className="modal-actions">
                <button className="btn-cancel" onClick={onClose} disabled={loading}>
                    Cancel
                </button>
                <button
                    className="btn-send"
                    disabled={selectedChatIds.length === 0 || loading}
                    onClick={handleForward}
                >
                    {loading ? "Sending..." : "Forward Message"}
                </button>
            </div>
        </div>
    );
}