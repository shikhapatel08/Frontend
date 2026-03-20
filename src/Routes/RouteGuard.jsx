import { Navigate } from "react-router-dom";

// ================================= Auth Routes ================================= //
export default function RouteGuard({ children, isPrivate }) {
    const token = localStorage.getItem("token");

    // ================================= isPrivate=true && !token => Signin ================================= //
    if (isPrivate && !token) {
        return <Navigate to="/" replace />;
    }   

    // ================================= isPrivate=false && token => MainPage ================================= //
    if (!isPrivate && token) {
        return <Navigate to="/MessagePage" replace />;
    }

    return children;
}