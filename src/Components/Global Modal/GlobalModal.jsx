import { useContext } from 'react';
import '../Global Modal/GlobalModal.css'
import { ThemeContext } from '../../Context/ThemeContext';


export default function GlobalModal({ children, onClose }) {
    const { theme, getThemeStyle } = useContext(ThemeContext);

    return (
        <div className="modal-overlay" onClick={onClose} >
            <div className="modal-box" onClick={(e) => e.stopPropagation()} style={getThemeStyle(theme)} >
                <button className="modal-close" onClick={onClose}>x</button>
                {children}
            </div>
        </div>
    )
}
