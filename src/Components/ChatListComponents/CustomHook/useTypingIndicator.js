import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useSocket } from "../../../Context/SocketContext";

export const useTypingIndicator = (setTypingChatId) => {
    const typingTimeout = useRef(null);
    const socket = useSocket();

    const Signup = useSelector(state => state.signup.SignupUser);
    const Signin = useSelector(state => state.signin.SigninUser);
    const user = Object.keys(Signin).length > 0 ? Signin : Signup;

    useEffect(() => {
        if (!socket || !user?.id) return;

        const handleTypingListener = (data) => {
            const socketData = typeof data === "string" ? JSON.parse(data) : data;

            const incomingChatId = Number(socketData.cid);
            const incomingUserId = Number(socketData.uid);

            if (incomingUserId !== Number(user.id)) {
                if (socketData.typing) {
                    setTypingChatId(incomingChatId);

                    if (typingTimeout.current) clearTimeout(typingTimeout.current);

                    typingTimeout.current = setTimeout(() => {
                        setTypingChatId(null);
                    }, 2000);
                } else {
                    setTypingChatId(null);
                }
            }
        };

        socket.on('typing', handleTypingListener);

        return () => {
            socket.off('typing', handleTypingListener);
            if (typingTimeout.current) clearTimeout(typingTimeout.current);
        };
    }, [socket, user?.id, setTypingChatId]);
};