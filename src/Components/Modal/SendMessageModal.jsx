import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import Button from "../Button/Button";
import { Searching, clearSearch } from "../../Redux/Features/SearchSlice";
import { FetchAllUser } from "../../Redux/Features/AllUserSlice";
import profile from "../../assets/Profile/profile.svg";
import "./SendMsgModal.css";
import { createOrGetChat, fetchMyChats, SelectedChat } from "../../Redux/Features/CreateChat";
import { useNavigate } from "react-router-dom";

export default function SendMsgModal({ onCancel }) {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { data: searchUsers, loading } = useSelector((state) => state.search);
    const { User: allusers } = useSelector((state) => state.alluser);

    const [searchText, setSearchText] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        dispatch(FetchAllUser());
    }, [dispatch]);

    useEffect(() => {
        setSelectedUser(null);

        const timer = setTimeout(() => {
            if (searchText.trim()) {
                dispatch(Searching({ name: searchText, limit: 10 }));
            } else {
                dispatch(clearSearch());
            }
        }, 400);

        return () => clearTimeout(timer);

    }, [searchText, dispatch]);

    const finalUsers = (searchText.trim() ? searchUsers : allusers) || [];

    const handleOnClick = useCallback((userId) => {
        dispatch(createOrGetChat({ receiverId: userId }))
            .unwrap()
            .then((chat) => {
                dispatch(SelectedChat(chat));
                dispatch(fetchMyChats({ page: 1 }));
                onCancel();
                navigate("/MessagePage");
            }).catch(console.error);
    }, [dispatch, navigate, onCancel]);

    return (
        <div className="sendModal">

            {/* HEADER */}
            <div className="modalHeader">
                <h3>New message</h3>
                {/* <span className="closeBtn" onClick={onCancel}>✕</span> */}
            </div>

            {/* SEARCH */}
            <div className="searchRow">
                <span>To:</span>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>

            {/* USER LIST */}
            <div className="userList">

                {loading ? (
                    <p className="loading">Loading users...</p>
                ) : finalUsers.length === 0 ? (
                    <p className="no-users">No Users Found</p>
                ) : (
                    finalUsers.map((user) => (

                        <div
                            key={user.id}
                            className="userItem"
                            onClick={() => setSelectedUser(user)}
                        >

                            <div className="userInfo">
                                <img src={user?.photo || profile} alt="profile" />

                                <div>
                                    <h4>{user?.name}</h4>
                                    <span>{user?.email}</span>
                                </div>
                            </div>

                            <input
                                type="radio"
                                checked={selectedUser?.id === user.id}
                                readOnly
                            />

                        </div>
                    ))
                )}

            </div>

            {/* BUTTON */}
            <Button
                className="chatBtn"
                disabled={!selectedUser}
                onClick={() => handleOnClick(selectedUser.id)}
            >
                Chat
            </Button>

        </div>
    );
}