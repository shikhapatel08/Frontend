import { useEffect } from "react";
import { useSocket } from "../../../Context/SocketContext";
import { useDispatch } from "react-redux";
import { setReactionLocal } from "../../../Redux/Features/SendMessage";

export const useReaction = () => {
    const socket = useSocket();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!socket) return;

        const handleNewReaction = (data) => {
            dispatch(setReactionLocal({
                msgId: data.msgId,
                userId: data.userId,
                emoji: data.emoji
            }));
        };

        const handleUpdatedReaction = (data) => {
            dispatch(setReactionLocal({
                msgId: data.msgId,
                userId: data.userId,
                emoji: data.emoji
            }));
        };

        const handleRemovedReaction = (data) => {
            dispatch(setReactionLocal({
                msgId: data.msgId,
                userId: data.userId,
                emoji: null
            }));
        };

        socket.on("new_reaction", handleNewReaction);
        socket.on("reaction_updated", handleUpdatedReaction);
        socket.on("reaction_removed", handleRemovedReaction);

        return () => {
            socket.off("new_reaction", handleNewReaction);
            socket.off("reaction_updated", handleUpdatedReaction);
            socket.off("reaction_removed", handleRemovedReaction);
        };

    }, [socket, dispatch]);
};
