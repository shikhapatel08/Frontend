import React from 'react';
import './Loader.css';

const Loader = ({ 
    size = 'medium', 
    color = 'primary', 
    fullPage = false, 
    backdrop = false,
    text = ''
}) => {
    const loaderClasses = `loader-spinner ${size} ${color}`;
    
    const content = (
        <div className="loader-content">
            <div className={loaderClasses}></div>
            {text && <p className="loader-text">{text}</p>}
        </div>
    );

    if (fullPage) {
        return (
            <div className={`loader-full-page ${backdrop ? 'backdrop' : ''}`}>
                {content}
            </div>
        );
    }

    return (
        <div className="loader-container-reusable">
            {content}
        </div>
    );
};

export default Loader;
