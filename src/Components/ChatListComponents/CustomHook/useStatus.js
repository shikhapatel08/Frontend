import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateOnlineStatus } from "../../../Redux/Features/CreateChat";
import { useSocket } from "../../../Context/SocketContext";

export const useStatus = () => {
    const socket = useSocket();
    const dispatch = useDispatch();
    useEffect(() => {
        if (!socket) return;

        const handleStatus = (data) => {
            try {
                const parsed =
                    typeof data === "string" ? JSON.parse(data) : data;

                console.log("ONLINE EVENT:", parsed);
                dispatch(updateOnlineStatus(parsed));
            } catch (err) {
                console.log("PARSE ERROR:", err, data);
            }
        };
        socket.on("online_status", handleStatus);

        return () => socket.off("online_status", handleStatus);
    }, [dispatch , socket]);
}