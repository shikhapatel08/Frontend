/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useSocket } from "../../../Context/SocketContext";

export const useTypingIndicator = (selectedChat, setIsOtherTyping, currentChat) => {
    const typingTimeout = useRef(null);
    const Signup = useSelector(state => state.signup.SignupUser);
    const Signin = useSelector(state => state.signin.SigninUser);
    const user = Object.keys(Signin).length > 0 ? Signin : Signup;
    const socket = useSocket();
    useEffect(() => {
        if (!socket || !selectedChat?.id) return;
        if (!selectedChat?.id) return;

        const handleTypingListener = (data) => {
            if (currentChat?.is_block) return;
            console.log("TYPING EVENT RECEIVED:", data);
            const socketData = JSON.parse(data);
            if (
                Number(socketData.rid) === Number(selectedChat.id) &&
                Number(socketData.uid) !== Number(user.id)
            ) {
                setIsOtherTyping(socketData.typing);
                clearTimeout(typingTimeout.current);
                typingTimeout.current = setTimeout(() => {
                    setIsOtherTyping(false);
                }, 1000);
            }
        };
        socket.on('typing', handleTypingListener);
        // socket.on(`${selectedChat?.id}_typing`, handleTypingListener);
        return () => {
            socket.off('typing', handleTypingListener);
            // socket.off(`${selectedChat.id}_typing`, handleTypingListener);
            clearTimeout(typingTimeout.current);
        };
    }, [selectedChat?.id, user?.id, setIsOtherTyping , socket]);

    // useEffect(() => {
    //     const socket = socketRef.current;
    //     if (!socket || !selectedChat?.id) return;

    //     const handleTyping = (data) => {
    //         const parsed = JSON.parse(data);
    //         if (Number(parsed.rid) === Number(selectedChat.id) && Number(parsed.uid) !== Number(userId)) {
    //             setIsOtherTyping(parsed.typing);
    //             clearTimeout(typingTimeout.current);
    //             typingTimeout.current = setTimeout(() => setIsOtherTyping(false), 1000);
    //         }
    //     };

    //     socket.on("typing", handleTyping);
    //     return () => {
    //         socket.off("typing", handleTyping);
    //         clearTimeout(typingTimeout.current);
    //     };
    // }, [selectedChat?.id, socketRef, userId, setIsOtherTyping]);
}