import React, { useCallback, useEffect, useRef, useState } from "react";
import TypingIndicator from "./TypingIndicator";
import MessageBubble from './MessageBubble'
import { useDispatch, useSelector } from "react-redux";
import { SelectedMessage } from "../../Redux/Features/SearchMsgSlice";
import { FetchMessages } from "../../Redux/Features/SendMessage";
import InfiniteScroll from 'react-infinite-scroll-component';
import { Icon } from "../Common Components/Icon/Icon";
import { useSocketMessages } from "./CustomHook/useSocketMessages";
import { useTypingIndicator } from "./CustomHook/useTypingIndicator";
import { useNotifications } from "./CustomHook/useNotifications";
import { useStatus } from "./CustomHook/useStatus";
import { useUpdateStatus } from "./CustomHook/useUpdateStatus";
import { useReaction } from "./CustomHook/useReaction";
import { MessageListSkeleton } from "../Common Components/Loader/PageSkeletons";
import { formatChatTime } from "./DateFormat";
import { useReplySuggestion } from "./CustomHook/useReplySuggestion";


export default function ConversationPanelMiddle({
    messages,
    selectedMessageId,
    JoinUser,
    selectedChat,
    isOtherTyping,
    chatRefs,
    setReplyMsg,
    setIsOtherTyping,
    currentChat,
    setText,
}) {

    const dispatch = useDispatch();
    const { hasMore, page, loading } = useSelector(state => state.message);

    const { chats } = useSelector(state => state.createchat);

    const { loading: textLoading } = useSelector(state => state.textFunctionally);
    // const socket = useSocket();

    const [replySuggestions, setReplySuggestions] = useState([]);


    useSocketMessages(selectedChat);
    useTypingIndicator(selectedChat, setIsOtherTyping, currentChat);
    useNotifications(chats, selectedChat);
    useStatus();
    useUpdateStatus(selectedChat);
    useReaction();
    useReplySuggestion(setReplySuggestions, selectedChat);


    const messagesEndRef = useRef(null);
    const [isNearBottom, setIsNearBottom] = useState(true);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsNearBottom(entry.isIntersecting);
            },
            {
                root: document.getElementById('scrollableDiv'),
                rootMargin: '150px', // True if within 150px from bottom (accounts for small jumps)
            }
        );

        if (messagesEndRef.current) {
            observer.observe(messagesEndRef.current);
        }

        return () => {
            if (messagesEndRef.current) {
                observer.unobserve(messagesEndRef.current);
            }
        };
    }, []);


    useEffect(() => {
        if (selectedMessageId) return;

        const lastMsg = messages[messages.length - 1];
        const isMyNewMessage = lastMsg?.sender_id === JoinUser && lastMsg?.pending;

        if (isNearBottom || isMyNewMessage) {
            const timer = setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [messages, isOtherTyping, JoinUser, isNearBottom, selectedMessageId]);

    const fetchMore = useCallback(() => {
        if (loading || !hasMore) return;

        dispatch(FetchMessages({
            chatId: selectedChat.id,
            page: page
        }));

    }, [page, loading, hasMore, selectedChat.id, dispatch]);

    useEffect(() => {
        if (selectedMessageId && chatRefs.current[selectedMessageId]) {
            const timer = setTimeout(() => {
                chatRefs.current[selectedMessageId].scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

                setTimeout(() => {
                    dispatch(SelectedMessage(null));
                }, 3000);
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [selectedMessageId]);


    return (
        <div
            id="scrollableDiv"
            className='ConversationPanel-middle'
            style={{ height: '100vh', overflow: 'auto', display: 'flex', flexDirection: 'column-reverse' }}
        >
            {textLoading && (
                <div className="loading-overlay">
                    <div className="loader-spinner"></div>
                    <span style={{ marginLeft: '10px', fontWeight: '500' }}>
                        Loading...
                    </span>
                </div>
            )}

            <InfiniteScroll
                dataLength={messages.length}
                next={!selectedMessageId ? fetchMore : () => { }}
                hasMore={!selectedMessageId && hasMore}
                inverse={true}
                scrollableTarget="scrollableDiv"
                scrollThreshold="100px"
                style={{ display: 'flex', flexDirection: 'column-reverse' }}
            >

                <div className="chat-container">
                    <div>
                    </div>
                    {loading && messages.length === 0 ? (
                        <MessageListSkeleton count={6} />
                    ) : messages.length > 0 ? (
                        <>
                            {messages.map((msg, index) => {
                                const currentDate = formatChatTime(msg.createdAt, 'chat');
                                const prevDate = index > 0 ? formatChatTime(messages[index - 1].createdAt, 'chat') : null;
                                const showDate = currentDate !== prevDate;

                                return (
                                    <React.Fragment key={msg.id}>
                                        {showDate && (
                                            <div className="date-separator">
                                                {currentDate}
                                            </div>
                                        )}
                                        <MessageBubble
                                            msg={msg}
                                            selectedMessageId={selectedMessageId}
                                            JoinUser={JoinUser}
                                            selectedChat={selectedChat}
                                            chatRefs={chatRefs}
                                            setReplyMsg={setReplyMsg}
                                        />

                                    </React.Fragment>

                                );

                            })}
                            {isOtherTyping && <TypingIndicator />}
                        </>
                    ) : (
                        <div className="ConversationPanel-placeholder">
                            <span><Icon /></span>
                            <h2>Start the Conversation!</h2>
                            <p>Say hello or share something interesting!</p>
                            <br></br>
                        </div>
                    )}


                    {replySuggestions?.suggestions?.length > 0 && Number(replySuggestions?.chatId) === Number(selectedChat?.id) && (
                        <div className="reply-suggestions">
                            {replySuggestions.suggestions.map((s, i) => (
                                <span
                                    key={i}
                                    className="suggestion-chip"
                                    onClick={() => {
                                        setText(s);
                                        setReplySuggestions([]);
                                    }}
                                >
                                    {s}
                                </span>
                            ))}
                        </div>
                    )}
                    {/* Dummy anchor at the absolute end of the message list */}
                    <div ref={messagesEndRef} style={{ height: "1px" }} />
                </div>
            </InfiniteScroll>
        </div >

    );
}
