import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const role = localStorage.getItem("role");

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    if (allowedRole && role !== allowedRole) {
        return <Navigate to="/auth" replace />;
    }

    return children;
};

export default ProtectedRoute;
