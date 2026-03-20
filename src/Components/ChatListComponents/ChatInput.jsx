import React from "react";
import { AttachmentIcon, SendMsgIcon } from "../Common Components/Icon/Icon";
import { useDispatch, useSelector } from "react-redux";
import { addLocalMessage, SendMessage } from "../../Redux/Features/SendMessage";
import { useSocket } from "../../Context/SocketContext";

export default function ChatInput({ text, fileInputRef, selectedChat, setText, setFilePreview, setFile, FilePreview, replyMsg, setReplyMsg, File, currentChat }) {
    const dispatch = useDispatch();
    const Signup = useSelector(state => state.signup.SignupUser);
    const Signin = useSelector(state => state.signin.SigninUser);
    const { canSendMessage } = useSelector(state => state.message);

    const user = Object.keys(Signin).length > 0 ? Signin : Signup;
    const socket = useSocket();

    // ---------------- TYPING ----------------

    const handleTypingInput = (e) => {
        if (currentChat?.is_block) return;
        setText(e.target.value);
        if (!selectedChat?.id) return;
        const data = JSON.stringify({
            rid: selectedChat.id,
            uid: user.id,
            typing: true
        });
        socket.emit("fe_typing", data);
    };  

    // ---------------- ENTER KEY ----------------

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // ---------------- FILE UPLOAD ----------------

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        const previews = files.map(file => URL.createObjectURL(file));

        setFilePreview(prev => [...prev, ...previews]);
        setFile(prev => [...prev, ...files]);
    };

    const handleAttachClick = () => {
        fileInputRef.current?.click();
    };


    const removeFile = () => {
        setFile([]);
        setFilePreview([]);

        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    };

    // ---------------- SEND MESSAGE ----------------

    const handleSendMessage = () => {

        if (currentChat?.is_block) return;

        if (!text && (!File || File.length === 0)) return;

        const tempId = Date.now();

        dispatch(addLocalMessage({
            id: tempId,
            // id:messages.msg.id,
            chatId: selectedChat.id,
            text,
            image_url: FilePreview,
            sender_id: user.id,
            is_star: false,
            is_pin: false,
            replyTo: replyMsg || null,
            status: 'sending',
            pending: true,
            createdAt: new Date().toISOString(),
        }));

        dispatch(SendMessage({
            tempId,
            chatId: selectedChat.id,
            messageText: text,
            file: File,
            replyTo: replyMsg?.id || null
        }));

        setReplyMsg(null);
        setText("");
        removeFile();
    };

    return (
        <div className="ConversationPanel-serach">
            <input
                type='text'
                placeholder="Type Your Message..."
                className="ConversationPanel-serach-input"
                value={text}
                onChange={handleTypingInput}
                onKeyDown={handleKeyPress}
                disabled={!canSendMessage}
            />
            <input
                type='file'
                multiple
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileUpload}
                disabled={!canSendMessage}

            />
            <span onClick={handleAttachClick}><AttachmentIcon /></span>
            <span onClick={handleSendMessage} ><SendMsgIcon /></span>
        </div>
    );
}