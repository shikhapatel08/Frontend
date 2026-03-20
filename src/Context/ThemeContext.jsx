import { createContext, useEffect, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "dark";
    }
    );

    const toggleTheme = () => {
        setTheme(prev => prev === "light" ? "dark" : "light")
    }

    useEffect(() => {
        localStorage.setItem("theme", theme);

        document.body.style.backgroundColor =
            theme === "light" ? "#fff" : "#000";

        document.body.style.color =
            theme === "light" ? "#000" : "#fff";

    }, [theme]);

    const getThemeStyle = (theme) => ({
        background: theme === "light" ? "#fff" : "#000",
        color: theme === "light" ? "#000" : "#fff",
        transition: "0.3s",
    });
    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, getThemeStyle }}>
            {children}
        </ThemeContext.Provider>
    )
}