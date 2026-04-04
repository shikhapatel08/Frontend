import { Navigate } from "react-router-dom";

export default function RouteGuard({ children, isPrivate }) {
    const token = localStorage.getItem("token");

    if (isPrivate && !token) {
        return <Navigate to="/" replace />;
    }

    if (!isPrivate && token) {
        return <Navigate to="/MessagePage" replace />;
    }

    return children;
}