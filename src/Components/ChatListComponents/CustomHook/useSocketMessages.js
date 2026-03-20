import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux";
import { UpdateChat } from "../../../Redux/Features/CreateChat";
import { addLocalMessage, deleteForEveryoneLocal, markChatSeen } from "../../../Redux/Features/SendMessage";
import { useSocket } from "../../../Context/SocketContext";

export const useSocketMessages = (selectedChat, messages, chats) => {
    // useRef is used to store the socket instance so it persists across re-renders
    // without creating multiple socket connections or duplicate event listeners.
    const Signin = useSelector(state => state.signin.SigninUser);
    const Signup = useSelector(state => state.signup.SignupUser);
    const user = Object.keys(Signin).length > 0 ? Signin : Signup;
    const dispatch = useDispatch();
    const socket = useSocket();

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (message) => {
            console.log("NEW MSG RECEIVED:", message);
            const msg = message.msg || message;


            const user = Object.keys(Signin).length > 0 ? Signin : Signup;
            const myId = user?.id;

            dispatch(UpdateChat(message));


            if (msg.sender_id === myId) return;

            const starSetting = msg.MessageSettings?.find(
                s => Number(s.user_id) === Number(user?.id)
            );

            dispatch(
                addLocalMessage({
                    id: msg.id,
                    chatId: msg.chat_id || msg.chatId,
                    text: msg.text,
                    image_url: typeof msg.image_url === "string" ? JSON.parse(msg.image_url) : msg.image_url,
                    is_star: starSetting?.is_star || false,
                    is_pin: false,
                    replyTo: msg.reply_to || null,
                    sender_id: msg.sender_id,
                    createdAt: msg.createdAt,
                })
            );
            if (selectedChat?.id === msg.chat_id) {
                socket.emit("fe_seen", {
                    cid: msg.chat_id,
                    uid: myId
                });
            }
        };

        socket.on("new_message", handleNewMessage);

        return () => socket.off("new_message", handleNewMessage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChat?.id, user?.id, messages, chats , socket]);

    useEffect(() => {
        if (!socket) return;

        const handler = (data) => {
            dispatch(deleteForEveryoneLocal(data.msgId));
        };

        socket.on("deleted", handler);

        return () => socket.off("deleted", handler);
    }, [dispatch, socket]);
    // useEffect(() => {
    //     const socket = socketRef.current;
    //     if (!socket) return;
    //     if (selectedChat) {
    //         socket.emit("fe_seen", {
    //             cid: selectedChat.id,
    //             uid: user.id,
    //         });
    //     }
    // }, [messages]);

    // useEffect(() => {
    //     const socket = socketRef.current;
    //     if (!socket) return;

    //     socket.on("seen", ({ cid }) => {
    //         dispatch(markChatSeen(cid));
    //     });

    //     return () => socket.off("seen");
    // }, []);

    useEffect(() => {
        if (!socket || !selectedChat?.id) return;
        socket.emit("fe_seen", { cid: selectedChat.id, uid: user?.id });

        socket.on("seen", ({ cid }) => {
            dispatch(markChatSeen(cid));
        });

        return () => socket.off("seen");
    }, [messages, selectedChat?.id, user?.id, dispatch]);


}