import { useEffect } from "react";
import { useSocket } from "../../../Context/SocketContext";

export const useReplySuggestion = (setReplySuggestions, selectedChat) => {
    const socket = useSocket();

    useEffect(() => {
        if (!socket) return;

        socket.on('reply_suggestions', (data) => {

            if (data.chatId !== String(selectedChat?.id)) return;

            setReplySuggestions({
                chatId: data.chatId,
                messageId: data.messageId,
                suggestions: data.suggestions
            });
        });

        return () => {
            socket.off('reply_suggestions');
        };
    }, [socket, setReplySuggestions]);
};