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

            // Only show notification if chat exists, is not muted, and not currently open
            if (chat && !chat.is_muted && !isCurrentChatOpen) {
                toast.success(msg.message);
            }

        };

        socket.on("new_noti", handleNoti);
        return () => socket.off("new_noti", handleNoti);
    }, [chats, selectedChat?.id, socket]);
};
