import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { UpdateChat } from "../../../Redux/Features/CreateChat";
import { useSocket } from "../../../Context/SocketContext";

export const useChatUpdate = (messages, chats) => {
    const dispatch = useDispatch();
    const socket = useSocket();

    useEffect(() => {
        if (!socket) return;

        const handleChatUpdate = (msg) => {
            console.log("chat_update received:", msg);

            // Dispatch to update chat in Redux
            dispatch(UpdateChat(msg));
        };

        socket.on("chat_update", handleChatUpdate);

        return () => {
            socket.off("chat_update", handleChatUpdate);
        };
    }, [messages, chats , socket]);
}