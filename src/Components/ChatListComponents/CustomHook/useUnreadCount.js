import { useEffect } from "react";
import { getSocket } from "../../../Socket.io/socket";
import { useDispatch } from "react-redux";
import { UnreadCount } from "../../../Redux/Features/CreateChat";
import { useSocket } from "../../../Context/SocketContext";

export const useUnreadCount = (messages) => {
    const dispatch = useDispatch();
    const socket = useSocket();
    useEffect(() => {
        if (!socket) return;

        const handleCount = (data) => {
            dispatch(UnreadCount(data));
        };

        socket.on("unread_count", handleCount);

        return () => {
            socket.off("unread_count", handleCount);
        };
    }, [messages , socket]);
}