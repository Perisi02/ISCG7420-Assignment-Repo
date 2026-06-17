import {Navigate} from "react-router-dom";
import {getStoredUser} from "../api/api";

function ProtectedRoute({children, adminOnly = false}) {
    const token = localStorage.getItem("token");
    const user = getStoredUser();

    if (!token) {
        return <Navigate to="/login" replace/>;
    }

    if (adminOnly && !user?.is_staff) {
        return <Navigate to="/" replace/>;
    }

    return children;
}

export default ProtectedRoute;