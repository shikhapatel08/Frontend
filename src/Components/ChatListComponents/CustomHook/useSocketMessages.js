import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UpdateChat } from "../../../Redux/Features/CreateChat";
import { addLocalMessage, deleteForEveryoneLocal } from "../../../Redux/Features/SendMessage";
import { useSocket } from "../../../Context/SocketContext";

export const useSocketMessages = (selectedChat) => {
    const dispatch = useDispatch();
    const socket = useSocket();
    const Signin = useSelector(state => state.signin.SigninUser);
    const Signup = useSelector(state => state.signup.SignupUser);
    const user = Object.keys(Signin).length > 0 ? Signin : Signup;
    const myId = user?.id;

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (message) => {
            const msg = message.msg || message;
            if (!msg) return;

            // Update chat list info (last message, etc.)
            dispatch(UpdateChat(message));

            // Don't add if it's our own message (already handled by local dispatch)
            if (msg.sender_id === myId) return;

            const starSetting = msg.MessageSettings?.find(
                s => Number(s.user_id) === Number(myId)
            );

            // Safe image_url parsing
            let parsedImages = [];
            if (msg.image_url) {
                try {
                    parsedImages = typeof msg.image_url === "string"
                        ? JSON.parse(msg.image_url)
                        : msg.image_url;
                } catch (e) {
                    parsedImages = [msg.image_url];
                }
            }

            dispatch(
                addLocalMessage({
                    id: msg.id,
                    chatId: msg.chat_id || msg.chatId,
                    text: msg.text,
                    image_url: parsedImages,
                    is_star: starSetting?.is_star || false,
                    is_pin: false,
                    replyTo: msg.replyMessage
                        ? {
                            id: msg.replyMessage.id,
                            text: msg.replyMessage.text,
                            image_url: msg.replyMessage.image_url,
                            sender_id: msg.replyMessage.sender?.id,
                            sender_name: msg.replyMessage.sender?.name
                        }
                        : null,
                    sender_id: msg.sender_id,
                    createdAt: msg.createdAt,
                })
            );

            // If we are currently viewing this chat, notify backend we've seen it
            if (Number(selectedChat?.id) === Number(msg.chat_id)) {
                socket.emit("fe_seen", {
                    cid: msg.chat_id,
                    uid: myId
                });
            }
        };

        const handleDeleteMessage = (data) => {
            dispatch(deleteForEveryoneLocal(data.msgId));
        };

        socket.on("new_message", handleNewMessage);
        socket.on("deleted", handleDeleteMessage);

        return () => {
            socket.off("new_message", handleNewMessage);
            socket.off("deleted", handleDeleteMessage);
        };
    }, [socket, selectedChat?.id, myId, dispatch]);
};
