import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { UpdateChat } from "../../../Redux/Features/CreateChat";
import { useSocket } from "../../../Context/SocketContext";

export const useChatUpdate = () => {
    const dispatch = useDispatch();
    const socket = useSocket();

    useEffect(() => {
        if (!socket) return;

        const handleChatUpdate = (msg) => {

            dispatch(UpdateChat(msg));
        };

        socket.on("chat_update", handleChatUpdate);

        return () => {
            socket.off("chat_update", handleChatUpdate);
        };
    }, [dispatch, socket]);
}
