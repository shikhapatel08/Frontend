import './ChatListPage.css';
import ChatList from '../../Components/ChatListComponents/ChatList';
import ChatPanel from '../../Components/ChatListComponents/ChatPanel';
import { useDispatch, useSelector } from 'react-redux';
import { useLayoutStyle } from '../../Components/Common Components/Common/CommonComponents';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../Context/ThemeContext';
import { Fetchsubscriptiondata } from '../../Redux/Features/subscriptions';
import { ProfileUser } from '../../Redux/Features/ProfileSlice';

export default function MessagePage() {
    const { selectedChat } = useSelector(state => state.createchat);
    const style = useLayoutStyle();
    const dispatch = useDispatch();
    const { getThemeStyle, theme } = useContext(ThemeContext);

    const [typingChatId, setTypingChatId] = useState(false);

    useEffect(() => {
        dispatch(Fetchsubscriptiondata());
        dispatch(ProfileUser())
    }, [dispatch]);


    return (
        <div className="ChatLayout" style={{ ...style, ...getThemeStyle(theme) }}>
            <div className={`Message-container ${selectedChat ? 'mobile-hide' : ''}`} style={getThemeStyle(theme)}>
                <ChatList typingChatId={typingChatId} />
            </div>
            <div className={`ConversationPanel-container ${!selectedChat ? "mobile-hide" : ""}`} style={getThemeStyle(theme)}>
                <ChatPanel typingChatId={typingChatId} setTypingChatId={setTypingChatId} />
            </div>
        </div>
    );
}
