import {useState} from "react";
import {useNavigate} from "react-router-dom";
import api, {saveAuth, saveUser} from "../api/api";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        password2: "",
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

        if (formData.password !== formData.password2) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post("/auth/register/", formData);

            saveAuth(response.data);

            const userResponse = await api.get("/auth/me/");
            saveUser(userResponse.data);

            navigate("/my-appointments");
            window.location.reload();
        } catch {
            setError("Registration failed. Please check your details.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="page-card">
            <h1>Register</h1>

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
                    Email
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
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

                <label>
                    Confirm Password
                    <input
                        type="password"
                        name="password2"
                        value={formData.password2}
                        onChange={handleChange}
                        required
                    />
                </label>

                <button type="submit" disabled={loading}>
                    {loading ? "Creating account..." : "Register"}
                </button>
            </form>
        </section>
    );
}

export default Register;