import {
    Link,
    useNavigate
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Layout({ children }) {

    const {
        isAuthenticated,
        user,
        logout
    } = useAuth();

    const {
        cartItemCount
    } = useCart();

    const navigate = useNavigate();

    const handleLogout = () => {

        logout();

        navigate("/login");
    };

    const isUser =
        user?.role === "USER";

    const isAdmin =
        user?.role === "ADMIN";

    return (
        <div className="app">

            <header className="navbar">

                <Link
                    to="/"
                    className="brand"
                >
                    📚 Bookstore
                </Link>

                <nav>

                    {isAuthenticated ? (

                        <>

                            <Link to="/books">
                                Books
                            </Link>

                            {isUser && (
                                <Link
                                    to="/cart"
                                    className="cart-nav-link"
                                >
                                    🛒 Cart
                                    {cartItemCount > 0 && (
                                        <span className="cart-count">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </Link>
                            )}

                            <Link to="/profile">
                                Profile
                            </Link>

                            {isAdmin && (
                                <span className="admin-badge">
                                    ADMIN
                                </span>
                            )}

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