import { createContext, useContext, useEffect, useState } from "react";
import { initSocket, getSocket, disconnectSocket } from "../Socket.io/socket";
import { useSelector } from "react-redux";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    const Signup = useSelector(state => state.signup.SignupUser);
    const Signin = useSelector(state => state.signin.SigninUser);
    const user = Object.keys(Signin).length > 0 ? Signin : Signup;

    const { token } = useSelector(state => state.signin);
    const { token: signupToken } = useSelector(state => state.signup);
    const { token: otpToken } = useSelector(state => state.otp);

    const finaltoken = token || signupToken || otpToken;

    useEffect(() => {
        if (!finaltoken || !user?.id) {
            disconnectSocket();
            setSocket(null);
            return;
        }

        initSocket(finaltoken, user.id);

        const s = getSocket();

        if (!s) return;

        const handleConnect = () => {
            console.log("Socket connected (context)");
            setSocket(s);
        };

        s.on("connect", handleConnect);
        if (s.connected) {
            setSocket(s);
        }

        return () => {
            s.off("connect", handleConnect);
            disconnectSocket();
            setSocket(null);
        };
    }, [finaltoken, user?.id]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
