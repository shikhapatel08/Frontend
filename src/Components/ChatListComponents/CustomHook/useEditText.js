import { useEffect } from "react"
import { useSocket } from "../../../Context/SocketContext"
import { useDispatch } from "react-redux";
import { updateMessageInstant } from "../../../Redux/Features/SendMessage";

export const useEditText = () => {
    const socket = useSocket();
    const dispatch = useDispatch();
    useEffect(() => {

        if (!socket) return


        const handleEdit = (data) => {
            dispatch(updateMessageInstant({ msgId: data.id, text: data.text, is_edited: true }))
        }
        socket.on("edit_msg", handleEdit)

        return () => socket.off("edit_msg", handleEdit);
    }, [socket]);
}