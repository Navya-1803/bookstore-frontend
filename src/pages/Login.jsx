import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        try {

            const response =
                await api.post("/users/login", formData);

            console.log("Login response:", response.data);

            const token = response.data.token;
            const user = response.data.user;

            login(token, user);

            navigate("/profile");

        } catch (error) {

            console.error("Login error:", error);

            setError(
                error.response?.data?.message ||
                "Invalid email or password"
            );
        }
    };

    return (
        <div className="auth-card">

            <h2>Welcome Back</h2>

            <p className="auth-subtitle">
                Login to your Bookstore account
            </p>

            <form onSubmit={handleSubmit}>

                <div className="form-group">
                    <label>Email</label>

                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>

                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="primary-button"
                >
                    Login
                </button>

            </form>

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            <p className="auth-footer">
                Don't have an account?{" "}
                <Link to="/register">
                    Register
                </Link>
            </p>

        </div>
    );
}

export default Login;