/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect } from "react";
import TypingIndicator from "./TypingIndicator";
import MessageBubble from './MessageBubble'
import { useDispatch, useSelector } from "react-redux";
import { SelectedMessage } from "../../Redux/Features/SearchMsgSlice";
import { FetchMessages } from "../../Redux/Features/SendMessage";
import { DeleteMe } from "../../Redux/Features/DeleteMeSlice";
import { DeleteEveryone } from "../../Redux/Features/DeleteEveryoneSlice";
import GlobalModal from "../Global Modal/GlobalModal";
import InfiniteScroll from 'react-infinite-scroll-component';
import { UpdateChat } from "../../Redux/Features/CreateChat";
import { AddNotification } from "../../Redux/Features/NotificationSlice";
import { Icon } from "../Common Components/Icon/Icon";
import { useSocketMessages } from "./CustomHook/useSocketMessages";
import { useTypingIndicator } from "./CustomHook/useTypingIndicator";
import { useNotifications } from "./CustomHook/useNotifications";
import { useStatus } from "./CustomHook/useStatus";
import { useSocket } from "../../Context/SocketContext";
import { formatChatTime } from "./DateFormat";

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
}) {

    const dispatch = useDispatch();
    const { hasMore, page } = useSelector(state => state.message);
    const { chats } = useSelector(state => state.createchat);

    const socket = useSocket();

    useSocketMessages(selectedChat, messages, chats);
    useTypingIndicator(selectedChat, setIsOtherTyping, currentChat);
    useNotifications(chats, selectedChat, messages);
    useStatus();

    const fetchMore = useCallback(() => {
        dispatch(FetchMessages({
            chatId: selectedChat.id,
            page: page
        }));
    }, [page, hasMore]);

    useEffect(() => {
        if (selectedMessageId && chatRefs.current[selectedMessageId]) {
            chatRefs.current[selectedMessageId].scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            const timer = setTimeout(() => {
                dispatch(SelectedMessage(null));
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [selectedMessageId, messages]);

    return (
        <div
            id="scrollableDiv"
            className='ConversationPanel-middle'
            style={{ height: '100vh', overflow: 'auto', display: 'flex', flexDirection: 'column-reverse' }}
        >

            <InfiniteScroll
                dataLength={messages.length}
                next={fetchMore}
                hasMore={hasMore}
                inverse={true}
                scrollableTarget="scrollableDiv"
                scrollThreshold="100px"
                style={{ display: 'flex', flexDirection: 'column-reverse' }}
            >

                <div className="chat-container">
                    <div>
                    </div>
                    {messages.length > 0 ?
                        (messages.map((msg, index) => {

                            const currentDate = formatChatTime(msg.createdAt, 'chat');

                            const prevDate =
                                index > 0
                                    ? formatChatTime(messages[index - 1].createdAt , 'chat')
                                    : null;

                            const showDate = currentDate !== prevDate;


                            return (
                                <React.Fragment key={msg.id}>

                                    {/* Date */}
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
                        })

                        ) : (
                            <div className="ConversationPanel-placeholder">
                                <span><Icon /></span>
                                <h2>Start the Conversation!</h2>
                                <p>Say hello or share something interesting!</p>
                                <br></br>
                            </div>
                        )}

                    {isOtherTyping && <TypingIndicator />}
                </div>
            </InfiniteScroll>
        </div >

    );
}