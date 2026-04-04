import { useEffect } from "react";
import { toast } from "react-toastify";
import { useSocket } from "../../../Context/SocketContext";

export const useNotifications = (chats, selectedChat) => {
    const socket = useSocket();

    useEffect(() => {
        if (!socket) return;

        const handleNoti = (msg) => {
            const chatId = Number(msg?.chatId);
            const chat = chats?.find((c) => c.id === chatId);
            const isCurrentChatOpen = Number(selectedChat?.id) === chatId;

            if (!isCurrentChatOpen) {

                if (chat && !chat.is_muted) {
                    toast.success(`${msg.senderName || 'New Message'}: ${msg.message}`);
                }

                const originalTitle = "ChatMe";
                document.title = `${msg.senderName || 'User'} messaged you...`;

                const favicon = document.querySelector('link[rel="icon"]');
                if (favicon) {
                    favicon.href = "/ChatMe-notify.svg";
                }

                const handleFocus = () => {
                    document.title = originalTitle;
                    if (favicon) {
                        favicon.href = "/ChatMe.svg";
                    }
                    window.removeEventListener('focus', handleFocus);
                };

                window.addEventListener('focus', handleFocus);
            }
        };

        socket.on("new_noti", handleNoti);

        return () => {
            socket.off("new_noti", handleNoti);
        };
    }, [chats, selectedChat?.id, socket]);
};