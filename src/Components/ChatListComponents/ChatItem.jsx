import { useMemo } from "react";
import ChatListDropdown from "./ChatListDropdown";

export const ChatItem = ({ chat, selectedChat, handleChatList, typingChatId, truncateMessage, JoinUser, profileImg }) => {

    const otherUser = useMemo(() => {
        return chat.UserOne.id === JoinUser ? chat.UserTwo : chat.UserOne;
    }, [chat, JoinUser]);

    const unreadCount = chat.unread_count || chat.ChatSettings?.[0]?.unread_count || 0;


    return (
        <div
            className={unreadCount > 0 && selectedChat?.id == chat.id ? 'MessageUser' : "Message-User"}
            onClick={() => handleChatList(chat, otherUser)}
            style={{ cursor: "pointer" }}
        >
            <div className="Message-Profile-img">
                <img src={otherUser?.photo ? otherUser?.photo : profileImg} alt='profile' />
            </div>
            <div className="Message-Username">
                <h2 className="chat-name">{otherUser?.name}</h2>
                {typingChatId === chat.id ? (
                    <span style={{ color: 'green', fontSize: '12px' }}>Typing...</span>
                ) : (
                    <span className="chat-last-message" style={{ color: 'grey' }}>
                        {truncateMessage(chat?.last_message)}
                    </span>
                )}
            </div>
            <ChatListDropdown
                chat={chat}
                otherUser={otherUser}
                unreadCount={unreadCount}
            />
        </div>
    );
};