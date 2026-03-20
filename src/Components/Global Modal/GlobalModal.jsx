import { useContext } from 'react';
import { useLayoutStyle } from '../Common Components/Common/CommonComponents'
import '../Global Modal/GlobalModal.css'
import { ThemeContext } from '../../Context/ThemeContext';

// ================================= Global Modal ================================= //

export default function GlobalModal({ children, onClose }) {
    const style = useLayoutStyle();
    const { theme, getThemeStyle } = useContext(ThemeContext); //theme toggle/ style apply

    return (
        <div className="modal-overlay" onClick={onClose} >
            <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{...style,...getThemeStyle(theme)}} >
                <button className="modal-close" onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    )
}