import { useDispatch, useSelector } from "react-redux";
import { useCallback, useContext, useEffect, useState } from "react";
import { Searching, clearSearch } from "../../Redux/Features/SearchSlice";
import { toggleSidebar } from "../../Redux/Features/SideBarSlice";
import { createOrGetChat, fetchMyChats, SelectedChat } from "../../Redux/Features/CreateChat";
import { useNavigate } from "react-router-dom";
import { useLayoutStyle } from "../../Components/Common Components/Common/CommonComponents";
import profile from "../../assets/Profile/profile.svg";
import { MenuIcon } from "../../Components/Common Components/Icon/Icon";
import '../Search/Search.css'
import { FetchAllUser } from "../../Redux/Features/AllUserSlice";
import { ThemeContext } from "../../Context/ThemeContext";
import { SearchSkeleton } from "../../Components/Common Components/Loader/PageSkeletons";

export default function SearchPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const style = useLayoutStyle();

    const { data: searchUsers, loading } = useSelector((state) => state.search);
    const { User: allusers } = useSelector((state) => state.alluser);
    const { getThemeStyle, theme } = useContext(ThemeContext);

    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        dispatch(FetchAllUser())
    }, [dispatch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchText.trim()) {
                dispatch(Searching({ name: searchText, limit: 4 }));
            } else {
                dispatch(clearSearch());
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [searchText, dispatch]);

    const handleUserClick = useCallback((userId) => {
        dispatch(createOrGetChat({ receiverId: userId }))
            .unwrap()
            .then(async (chat) => {
                dispatch(SelectedChat(chat));
                await dispatch(fetchMyChats({ page: 1 }));

                navigate("/MessagePage");
            }).catch(console.error);
    }, [dispatch, navigate]);

    const handleSidebar = () => {
        dispatch(toggleSidebar());
    }

    const usersToShow = searchText.trim() ? searchUsers : allusers;

    return (
        <div className="search-container"
            style={{ ...style, ...getThemeStyle(theme) }}>
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
                        Search User
                    </h2>
                </span>
            </div>

            <div className="Search">
                <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search by name or email..."
                    className="Serach-input"
                />
            </div>

            <div className="search-results" style={getThemeStyle(theme)}>
                {loading ? (
                    <SearchSkeleton count={5} />
                ) : usersToShow.length === 0 ? (

                    <p className="no-users">No Users Found</p>
                ) : (
                    usersToShow.map((user) => (
                        <div className="search-user" key={user.id} onClick={() => handleUserClick(user.id)} style={getThemeStyle(theme)}>
                            <img src={user?.photo || profile} alt="profile" />
                            <div className="user-info">
                                <span>{user?.name}</span>
                                <span style={{ color: "grey" }}>{user?.email}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}