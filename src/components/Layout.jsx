import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Layout({ children }) {

    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="app">

            <header className="navbar">

                <Link to="/" className="brand">
                    📚 Bookstore
                </Link>

                <nav>

                    {isAuthenticated ? (
                        <>
                            <Link to="/books">
                                Books
                            </Link>

                            <Link to="/profile">
                                Profile
                            </Link>

                            <button
                                className="nav-logout"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                Login
                            </Link>

                            <Link to="/register">
                                Register
                            </Link>
                        </>
                    )}

                </nav>

            </header>

            <main className="main-content">
                {children}
            </main>

        </div>
    );
}

export default Layout;