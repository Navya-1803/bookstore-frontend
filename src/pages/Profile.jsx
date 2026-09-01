import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Profile() {

    const { user, setUser, logout } = useAuth();

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
    });

    const [message, setMessage] = useState("");
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

        setMessage("");
        setError("");

        try {

            const response =
                await api.put(
                    "/users/profile",
                    formData
                );

            setUser(response.data);

            setMessage("Profile updated successfully.");

        } catch (error) {

            console.error(
                "Profile update error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to update profile."
            );
        }
    };

    const handleLogout = () => {

        logout();
        navigate("/login");
    };

    if (!user) {
        return <p>Loading profile...</p>;
    }

    return (
        <div className="profile-container">

            <div className="profile-header">
                <h2>My Profile</h2>

                <p>
                    Manage your account information
                </p>
            </div>

            <div className="profile-card">

                <div className="profile-info">

                <span className="profile-label">
                    Name
                </span>

                    <span className="profile-value">
                    {user.name}
                </span>

                    <span className="profile-label">
                    Email
                </span>

                    <span className="profile-value">
                    {user.email}
                </span>

                    <span className="profile-label">
                    Role
                </span>

                    <span className="profile-value">
                    {user.role}
                </span>

                </div>

                <h3>Update Profile</h3>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>Name</label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="form-group">

                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />

                    </div>

                    <button
                        type="submit"
                        className="primary-button"
                    >
                        Update Profile
                    </button>

                </form>

                {message && (
                    <p className="success-message">
                        {message}
                    </p>
                )}

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

            </div>

        </div>
    );
}

export default Profile;