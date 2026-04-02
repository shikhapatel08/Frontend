import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyChats, SelectedChat } from "../../Redux/Features/CreateChat";
import { useModal } from "../../Context/ModalContext";
import { FetchAllPinnedMsg, FetchMessages, PinMsg, Pinmsg, resetMessages, SendMessage, Starmsg, StarMsg } from "../../Redux/Features/SendMessage";
import { DeleteMe } from "../../Redux/Features/DeleteMeSlice";
import { DeleteEveryone } from "../../Redux/Features/DeleteEveryoneSlice";
import { BlockedUser } from "../../Redux/Features/BlockedSlice";
import { toast } from "react-toastify";
import { SearchMsg, SelectedMessage, UpdatecurrentIndex, UpdateSearchResult, UpdateTotalResults } from "../../Redux/Features/SearchMsgSlice";
import { FaFileAlt, FaFileExcel, FaFilePdf, FaFileWord } from "react-icons/fa";
import { AttachmentIcon, BackbtnIcon, DoubleTicksIcon, DownArrow, Icon, MenuIcon, SendMsgIcon, SerachIcon, SingleTicksIcon, StarIcon, UpArrow } from "../Common Components/Icon/Icon";
import GlobalModal from "../Global Modal/GlobalModal";
import ChatHeader from "./ChatHeader";
import MessageList from './MessageList'
import FilePreviewList from "./FilePreviewList";
import ChatInput from "./ChatInput";
import BlockedChatModal from "../Modal/BlockedUser";
import Button from "../Button/Button";
import SendMsgModal from "../Modal/SendMessageModal";
import { toggleSidebar } from "../../Redux/Features/SideBarSlice";


export default function ChatPanel() {
    const dispatch = useDispatch();
    const { chats, selectedChat } = useSelector(state => state.createchat);
    const [openMenuId, setOpenMenuId] = useState(null);
    const chatRefs = useRef({});
    const fileInputRef = useRef(null);
    const { messages, pinnedMessages } = useSelector(state => state.message);
    const [text, setText] = useState("");
    const [isOtherTyping, setIsOtherTyping] = useState(false);
    const [replyMsg, setReplyMsg] = useState(null);
    const [FilePreview, setFilePreview] = useState([]);
    const [File, setFile] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchText, setSearchText] = useState("");
    const { openModal, closeModal } = useModal();
    const { selectedMessageId } = useSelector(state => state.searchMsg);
    const [pinIndex, setPinIndex] = useState(0);
    const Signup = useSelector(state => state.signup.SignupUser);
    const Signin = useSelector(state => state.signin.SigninUser);
    const user = Object.keys(Signin).length > 0 ? Signin : Signup;
    const JoinUser = user?.id;
    const chatEndRef = useRef(null);
    const { loading } = useSelector(state => state.blocked);
    const { searchResults, currentIndex, totalResults } = useSelector(state => state.searchMsg);
    const searchTimeout = useRef(null);


    const handleNextPin = () => {
        if (!pinnedMessages.length) return;

        setPinIndex(prev => {
            const nextIndex = (prev + 1) % pinnedMessages.length; // circular next index
            const nextPinnedMsg = pinnedMessages[nextIndex];

            const isMsgLoaded = messages.some(m => Number(m.id) === Number(nextPinnedMsg.id));

            // Fetch messages for the pinned message's page
            if (!isMsgLoaded) {
                dispatch(FetchMessages({
                    chatId: selectedChat.id,
                    page: nextPinnedMsg.page
                }));
            }

            dispatch(SelectedMessage(nextPinnedMsg.id));

            return nextIndex;
        });
    };

    const currentChat = useMemo(() =>
        chats.find(c => c.id === selectedChat?.id),
        [chats, selectedChat?.id]
    );

    const filteredMessages = useMemo(() => {
        return messages?.filter(m => Number(m.chatId) === Number(selectedChat?.id));
    }, [messages, selectedChat?.id]);

    const Blocked = async (chat) => {
        await dispatch(BlockedUser(chat.id)).then(() => {
        });
        if (chat?.is_block) {
            toast.success("User unblocked!");
        } else {
            toast.error("User blocked!");
        }
        const updatedChat = { ...chat, is_block: !chat.is_block };
        if (selectedChat?.id === chat.id) {
            dispatch(SelectedChat({
                ...selectedChat,
                is_block: updatedChat.is_block
            }));
        }
    };

    const handleBlocked = (chat) => {
        openModal(
            <GlobalModal onClose={closeModal}>
                <BlockedChatModal
                    onCancel={closeModal}
                    isBlocked={selectedChat?.is_block}
                    onConfirm={() => {
                        Blocked(chat);
                        closeModal();
                    }}
                    loading={loading}
                />
            </GlobalModal>
        )
    };

    const removeSingleFile = (index) => {
        const newPreviews = [...FilePreview];
        const newFiles = [...File];

        URL.revokeObjectURL(newPreviews[index]);

        newPreviews.splice(index, 1);
        newFiles.splice(index, 1);

        setFilePreview(newPreviews);
        setFile(newFiles);
    };

    useEffect(() => {
        return () => {
            FilePreview.forEach(url => URL.revokeObjectURL(url));
        };
    }, [FilePreview]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const chatMenuOpen = chatRefs.current[openMenuId]?.contains(event.target);
            if (openMenuId && !chatMenuOpen) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [openMenuId]);

    useEffect(() => {

        if (!selectedChat?.id) return;

        dispatch(resetMessages());
        dispatch(FetchMessages({ chatId: selectedChat?.id, page: 1 }));
        dispatch(FetchAllPinnedMsg({ chatId: selectedChat?.id }))

        console.log("First Me")

    }, [selectedChat?.id]);

    useEffect(() => {
        if (!JoinUser) return;
        dispatch(fetchMyChats({ page: 1 }));

    }, [JoinUser]);


    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({
                behavior: "smooth",
                block: "end"
            });
        }
    }, [messages?.length]);

    useEffect(() => {
        if (!selectedMessageId) return;

        const timer = setTimeout(() => {
            const el = chatRefs.current[selectedMessageId];
            if (el) {
                el.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [selectedMessageId, messages]);


    useEffect(() => {
        if (pinnedMessages?.length) {
            localStorage.setItem('PinnedMsg', JSON.stringify(pinnedMessages));
        }
    }, [pinnedMessages]);

    const handleButton = () => {
        openModal(
            <GlobalModal onClose={closeModal}>
                <SendMsgModal
                    onCancel={closeModal}
                />
            </GlobalModal>
        )

    }

    const handleHamburgerIcon = () => {
        dispatch(toggleSidebar());
    };

    const handleSearch = (value) => {

        setSearchText(value);

        if (!value.trim()) {
            dispatch(UpdateSearchResult([]));
            return;
        }

        // old timeout clear karo
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        // new timeout
        searchTimeout.current = setTimeout(async () => {

            const res = await dispatch(SearchMsg({
                chatId: selectedChat.id,
                searchTerm: value, // value use karo (NOT searchText)
                page: 1
            }));

            const results = res.payload?.msg;
            const total = res.payload?.totalResults;

            if (!results || results.length === 0) {
                console.log("No results found");
                return;
            }

            dispatch(UpdateSearchResult(results));
            dispatch(UpdatecurrentIndex(0));
            dispatch(UpdateTotalResults(total))

            const first = results[0];

            // dispatch(resetMessages());

            await dispatch(FetchMessages({
                chatId: selectedChat.id,
                page: first.page
            }));

            setTimeout(() => {
                dispatch(SelectedMessage(first.msgId));
            }, 300);
            closeModal();

        }, 500);
    };

    const handleClose = () => {
        setIsSearching(false);
        setText("");
        setSearchText("");

        dispatch(UpdateSearchResult([]));
        dispatch(UpdateTotalResults(0));
        dispatch(UpdatecurrentIndex(0));
        dispatch(SelectedMessage(null));

        dispatch(resetMessages());

        if (selectedChat?.id) {
            dispatch(FetchMessages({
                chatId: selectedChat.id,
                page: 1
            }));
        }
    };
    const handleNext = () => {
        if (currentIndex < searchResults.length - 1) {
            const nextIndex = currentIndex + 1;
            const item = searchResults[nextIndex];
            dispatch(UpdatecurrentIndex(nextIndex));
            // dispatch(resetMessages());

            dispatch(FetchMessages({
                chatId: selectedChat.id,
                page: item.page
            })).then(() => {
                setTimeout(() => {
                    dispatch(SelectedMessage(item.msgId));
                }, 300);
            });
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            const item = searchResults[prevIndex];
            dispatch(UpdatecurrentIndex(prevIndex));
            // dispatch(resetMessages());

            dispatch(FetchMessages({
                chatId: selectedChat.id,
                page: item.page
            })).then(() => {
                setTimeout(() => {
                    dispatch(SelectedMessage(item.msgId));
                }, 300);
            });
        }
    };

    useEffect(() => {
        return () => {
            if (searchTimeout.current) {
                clearTimeout(searchTimeout.current);
            }
        };
    }, []);

    useEffect(() => {
        setSearchText('');
        setIsSearching(false);
    }, [selectedChat?.id])

    return (
        // ================================= Chat Window ================================= //
        <div className="ConversationPanel-User">
            {selectedChat ? (
                <>
                    {/* Chat Header */}

                    <ChatHeader
                        selectedChat={selectedChat}
                        JoinUser={JoinUser}
                        currentChat={currentChat}
                        setIsSearching={setIsSearching}
                    />

                    {/* Pinned Message */}
                    {isSearching ?
                        <div className="search-bar">
                            <div></div>
                            <input
                                type="text"
                                placeholder="Search messages..."
                                value={searchText}
                                onChange={(e) => handleSearch(e.target.value)}
                                autoFocus
                                className="search-input"
                            />

                            <div className="search-count">
                                <span>{totalResults > 0 ? currentIndex + 1 : 0}</span>
                                <span>/</span>
                                <span>{totalResults > 0 ? totalResults : 0}</span>
                            </div>
                            <span className="search-arrow" onClick={handleNext}>
                                <UpArrow />
                            </span>
                            <span className="search-arrow" onClick={handlePrev}  >
                                <DownArrow />
                            </span>

                            <span className="" onClick={handleClose}>Cancel</span>
                        </div>
                        : pinnedMessages.length > 0 && (
                            <div className="pinned-msg" onClick={handleNextPin}>

                                <div className="pin-indicator">
                                    {pinnedMessages.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`pin-dot ${i === pinIndex ? "active" : ""}`}
                                        />
                                    ))}
                                </div>
                                <span className="material-symbols-outlined" style={{ color: 'grey' }}>keep</span>

                                <p className="pin-text">
                                    {pinnedMessages[pinIndex]?.text}
                                </p>

                            </div>
                        )}
                    <MessageList
                        messages={filteredMessages}
                        selectedMessageId={selectedMessageId}
                        JoinUser={JoinUser}
                        selectedChat={selectedChat}
                        isOtherTyping={isOtherTyping}
                        chatRefs={chatRefs}
                        chatEndRef={chatEndRef}
                        setReplyMsg={setReplyMsg}
                        currentChat={currentChat}
                        setIsOtherTyping={setIsOtherTyping}
                        chats={chats}
                        setText={setText}
                    />
                    {/* </>
                    )} */}

                    {currentChat?.is_block && (
                        <div className="blocked-user">
                            <h4>You've blocked this account</h4>

                            <Button onClick={() => handleBlocked(currentChat)}>
                                Unblock
                            </Button>
                        </div>
                    )}

                    {/* File Previews */}
                    <FilePreviewList
                        FilePreview={FilePreview}
                        removeSingleFile={removeSingleFile}
                    />

                    <div className="ConversationPanel-bottom">
                        {!currentChat?.is_block &&
                            <>
                                {/* Chat Input */}
                                < ChatInput
                                    text={text}
                                    setText={setText}
                                    selectedChat={selectedChat}
                                    fileInputRef={fileInputRef}
                                    setFile={setFile}
                                    setFilePreview={setFilePreview}
                                    FilePreview={FilePreview}
                                    setReplyMsg={setReplyMsg}
                                    replyMsg={replyMsg}
                                    setIsOtherTyping={setIsOtherTyping}
                                    File={File}
                                    currentChat={currentChat}
                                    JoinUser={JoinUser}
                                />
                            </>
                        }
                    </div>

                </>
            ) : (
                <>
                    <span className="Menu" onClick={handleHamburgerIcon}><MenuIcon /></span>

                    <div className="ConversationPanel-placeholder">
                        <span><Icon /></span>
                        <h2>Your messages</h2>
                        <p>Send a message to start a chat.</p>
                        <br></br>
                        <Button onClick={handleButton}>Send Message</Button>
                    </div>
                </>

            )}
        </div>
    );

}
