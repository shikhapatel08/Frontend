import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClearSearchResults, SearchMsg, SelectedMessage } from "../../Redux/Features/SearchMsgSlice";
import "./Searching.css";
import { useModal } from "../../Context/ModalContext";
import { FetchMessages, resetMessages, StarMsg } from "../../Redux/Features/SendMessage";
import InfiniteScroll from 'react-infinite-scroll-component';
import { ThemeContext } from "../../Context/ThemeContext";

// ================================= Seraching Message Modal ================================= //

export default function Searching() {

    // ================================= Hook ================================= //
    const [searchText, setSearchText] = useState("");
    const dispatch = useDispatch();

    const { searchResults, loading, page, hasMore } = useSelector(state => state.searchMsg);
    const { selectedChat } = useSelector(state => state.createchat);
    const modalRef = useRef(null);
    const { closeModal } = useModal();
    const { getThemeStyle, theme } = useContext(ThemeContext);

    // ================================= Function =================================//
    const handleClose = () => {
        closeModal(); // modal Close
    };

    // ================================= USeEffect ================================= //
    useEffect(() => {

        if (!searchText.trim()) {
            dispatch(ClearSearchResults());
            return;
        }

        if (!selectedChat?.id) return;

        const timer = setTimeout(() => {

            dispatch(SearchMsg({
                chatId: selectedChat.id,
                searchTerm: searchText,
                page: 1
            }));


        }, 500);

        return () => clearTimeout(timer);

    }, [searchText, selectedChat?.id]);

    const FetchMore = () => {
        if (!hasMore) return;

        dispatch(SearchMsg({
            chatId: selectedChat.id,
            searchTerm: searchText,
            page
        }))
    }

    const handleItem = (data) => {
        // dispatch(resetMessages());

        // dispatch(FetchMessages({
        //     chatId: selectedChat.id,
        //     page: data.page
        // }));

        dispatch(SelectedMessage(data.msgId));
        closeModal();
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                closeModal();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        // ================================= Seraching Messages ================================= //
        <div className="search-modal" >
            <div className="search-modal-box" ref={modalRef} style={getThemeStyle(theme)}>
                <button className="close-btn" onClick={handleClose}>✕</button>

                <input
                    type="text"
                    value={searchText}
                    className="search-input"
                    placeholder="Searching Messages..."
                    onChange={(e) => setSearchText(e.target.value)}
                    autoFocus
                />

                {loading && <p>Searching...</p>}

                {/* ================================= Seraching Message Show ================================= */}
                <InfiniteScroll
                    dataLength={searchResults.length}
                    next={FetchMore}
                    hasMore={hasMore}
                    // scrollableTarget="scrollableDiv"
                    scrollThreshold={0.8}
                // style={{ display: 'flex', flexDirection: 'column' }}
                >
                    {searchResults.length > 0 && (
                        <div className="search-results">
                            {searchResults.map((data, i) => (
                                <div key={i} className="search-item" onClick={() => handleItem(data)} >
                                    <p>{data.text}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && searchText && searchResults.length === 0 && (
                        <p className="no-result">No messages found</p>
                    )}
                </InfiniteScroll>
            </div>
        </div>
    );
}
