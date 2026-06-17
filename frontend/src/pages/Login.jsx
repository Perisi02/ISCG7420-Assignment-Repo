import {useState} from "react";
import {useNavigate} from "react-router-dom";
import api, {saveAuth} from "../api/api";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(event) {
        const {name, value} = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login/", formData);

            saveAuth(response.data);

            if (response.data.user.is_staff) {
                navigate("/admin");
            } else {
                navigate("/my-appointments");
            }

            window.location.reload();
        } catch {
            setError("Invalid username or password.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="page-card">
            <h1>Login</h1>

            {error && <p className="error-message">{error}</p>}

            <form className="form-layout" onSubmit={handleSubmit}>
                <label>
                    Username
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Password
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </label>

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </section>
    );
}

export default Login;