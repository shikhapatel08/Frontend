import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "../../../Context/SocketContext";
import { seen } from "../../../Redux/Features/CreateChat";
import { updateMessageStatus } from "../../../Redux/Features/SendMessage.js";

export const useUpdateStatus = (selectedChat) => {
    const dispatch = useDispatch();
    const socket = useSocket();

    const Signin = useSelector(state => state.signin.SigninUser);
    const Signup = useSelector(state => state.signup.SignupUser);
    const user = Object.keys(Signin).length > 0 ? Signin : Signup;
    const myId = user?.id;

    useEffect(() => {
        if (!socket || !selectedChat?.id || !myId) return;

        socket.emit("fe_seen", {
            cid: selectedChat.id,
            uid: myId,
        });

        const handleSeen = (data) => {
            const { cid } = data;

            if (cid === selectedChat.id) {
                dispatch(seen({ cid }));

                dispatch(updateMessageStatus({
                    chatId: cid,
                    status: "seen",
                }));
            }
        };

        socket.on("seen", handleSeen);

        return () => {
            socket.off("seen", handleSeen);
        };
    }, [socket, selectedChat?.id, myId, dispatch]);
};
