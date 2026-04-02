// import { useContext, useEffect, useRef, useState, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { ClearSearchResults, SearchMsg, SelectedMessage } from "../../Redux/Features/SearchMsgSlice";
// import "./Searching.css";
// import { useModal } from "../../Context/ModalContext";
// import { FetchMessages, resetMessages } from "../../Redux/Features/SendMessage";
// import InfiniteScroll from 'react-infinite-scroll-component';
// import { ThemeContext } from "../../Context/ThemeContext";

// // ================================= Searching Message Modal ================================= //

// export default function Searching() {

//     // ================================= Hooks ================================= //
//     const [searchText, setSearchText] = useState("");
//     const dispatch = useDispatch();

//     // Default to empty array/object to prevent crashes if Redux state is uninitialized
//     const { searchResults = [], loading, page, hasMore } = useSelector(state => state.searchMsg) || {};
//     const { selectedChat } = useSelector(state => state.createchat) || {};

//     const modalRef = useRef(null);
//     const { closeModal } = useModal();
//     const { getThemeStyle, theme } = useContext(ThemeContext);

//     // ================================= Functions =================================//
//     const handleClose = useCallback(() => {
//         closeModal();
//     }, [closeModal]);

//     const FetchMore = useCallback(() => {
//         if (!hasMore || !selectedChat?.id || !searchText.trim()) return;

//         dispatch(SearchMsg({
//             chatId: selectedChat.id,
//             searchTerm: searchText,
//             page: page // Assuming your Redux correctly updates 'page' to the next page to fetch
//         }));
//     }, [hasMore, selectedChat?.id, dispatch, searchText, page]);

//     const handleItem = useCallback((data) => {
//         if (!selectedChat?.id) return;
//         dispatch(resetMessages());
//         dispatch(FetchMessages({
//             chatId: selectedChat.id,
//             page: data.page
//         })).then(() => {
//             dispatch(SelectedMessage(data.msgId));
//             closeModal();
//         });
//     }, [dispatch, closeModal, selectedChat?.id]);


//     // ================================= UseEffects ================================= //
//     useEffect(() => {
//         if (!searchText.trim()) {
//             dispatch(ClearSearchResults());
//             return;
//         }

//         if (!selectedChat?.id) return;

//         // Debounce search input to prevent rapid API calls
//         const timer = setTimeout(() => {
//             dispatch(SearchMsg({
//                 chatId: selectedChat.id,
//                 searchTerm: searchText,
//                 page: 1
//             }));
//         }, 500);

//         return () => clearTimeout(timer);

//     }, [searchText, selectedChat?.id, dispatch]); // Added missing dispatch dependency

//     useEffect(() => {
//         return () => {
//             dispatch(ClearSearchResults());
//         };
//     }, [dispatch]);

//     // Outside Click closer
//     useEffect(() => {
//         const handleClickOutside = (e) => {
//             if (modalRef.current && !modalRef.current.contains(e.target)) {
//                 closeModal();
//             }
//         };

//         document.addEventListener("mousedown", handleClickOutside);

//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, [closeModal]); // Added missing closeModal dependency

//     return (
//         // ================================= Searching Messages ================================= //
//         <div className="search-modal">
//             <div className="search-modal-box" ref={modalRef} style={getThemeStyle(theme)}>
//                 <button className="close-btn" onClick={handleClose}>✕</button>

//                 <input
//                     type="text"
//                     value={searchText}
//                     className="search-input"
//                     placeholder="Searching Messages..."
//                     onChange={(e) => setSearchText(e.target.value)}
//                     autoFocus
//                 />

//                 {loading && <p>Searching...</p>}

//                 {/* ================================= Searching Message Show ================================= */}
//                 <InfiniteScroll
//                     dataLength={searchResults.length}
//                     next={FetchMore}
//                     hasMore={hasMore}
//                     scrollThreshold={0.8}
//                 >
//                     {searchResults.length > 0 && (
//                         <div className="search-results">
//                             {searchResults.map((data, i) => (
//                                 // CORRECTION: Use `data.msgId` instead of array index `i` for React keys to prevent rendering bugs on updates
//                                 <div
//                                     key={data.msgId || i}
//                                     className="search-item"
//                                     onClick={() => handleItem(data)}
//                                     role="button"
//                                     tabIndex={0}
//                                 >
//                                     <p>{data.text}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     )}

//                     {!loading && searchText && searchResults.length === 0 && (
//                         <p className="no-result">No messages found</p>
//                     )}
//                 </InfiniteScroll>
//             </div>
//         </div>
//     );
// }
