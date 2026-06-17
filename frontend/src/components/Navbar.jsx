import {Link, useNavigate} from "react-router-dom";
import {clearAuth, getStoredUser} from "../api/api";

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const user = getStoredUser();

    function handleLogout() {
        clearAuth();
        navigate("/");
        window.location.reload();
    }

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/">Piki Ora Medical Centre</Link>
            </div>

            <div className="nav-links">
                <Link to="/doctors">Doctors</Link>
                <Link to="/slots">Slots</Link>

                {token && !user?.is_staff && (
                    <Link to="/my-appointments">My Appointments</Link>
                )}

                {token && user?.is_staff && (
                    <>
                        <Link to="/admin">Admin Dashboard</Link>
                        <Link to="/admin/doctors">Manage Doctors</Link>
                        <Link to="/admin/slots">Manage Slots</Link>
                        <Link to="/admin/appointments">Manage Appointments</Link>
                        <Link to="/admin/patients">Manage Patients</Link>
                    </>
                )}

                {!token ? (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                ) : (
                    <button type="button" onClick={handleLogout}>
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;