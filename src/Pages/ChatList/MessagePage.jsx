import './ChatListPage.css';
import ChatList from '../../Components/ChatListComponents/ChatList';
import ChatPanel from '../../Components/ChatListComponents/ChatPanel';
import { useSelector } from 'react-redux';
import { useLayoutStyle } from '../../Components/Common Components/Common/CommonComponents';
import { useContext } from 'react';
import { ThemeContext } from '../../Context/ThemeContext';

export default function MessagePage() {
    const { selectedChat } = useSelector(state => state.createchat);
    const style = useLayoutStyle();
    const { getThemeStyle, theme } = useContext(ThemeContext);


    return (
        <div className="ChatLayout" style={{...style , ...getThemeStyle(theme)}}>
            <div className={`Message-container ${selectedChat ? 'mobile-hide' : ''}`} style={getThemeStyle(theme)}>
                <ChatList />
            </div>
            <div className={`ConversationPanel-container ${!selectedChat ? "mobile-hide" : ""}`} style={getThemeStyle(theme)}>
                <ChatPanel />
            </div>
        </div>
    );
}