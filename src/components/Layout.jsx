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
                    Bookstore
                </Link>

                <nav>

                    {isAuthenticated ? (

                        <>

                            {/* Books - available to both User and Admin */}

                            <Link
                                to="/books"
                                className="nav-link"
                            >
                                Books
                            </Link>


                            {/* USER NAVIGATION */}

                            {isUser && (
                                <>

                                    <Link
                                        to="/cart"
                                        className="cart-nav-link"
                                    >
                                        Cart

                                        {cartItemCount > 0 && (
                                            <span className="cart-count">
                                                {cartItemCount}
                                            </span>
                                        )}
                                    </Link>


                                    <Link
                                        to="/orders"
                                        className="nav-link"
                                    >
                                        Orders
                                    </Link>


                                    <Link
                                        to="/wishlist"
                                        className="nav-link"
                                    >
                                        Wishlist
                                    </Link>


                                    <Link
                                        to="/customer-details"
                                        className="nav-link"
                                    >
                                        My Details
                                    </Link>

                                </>
                            )}


                            {/* ADMIN NAVIGATION */}

                            {isAdmin && (
                                <Link
                                    to="/admin/orders"
                                    className="nav-link"
                                >
                                    Orders
                                </Link>
                            )}


                            {/* PROFILE */}

                            <Link
                                to="/profile"
                                className="nav-link"
                            >
                                Profile
                            </Link>


                            {/* ADMIN BADGE */}

                            {isAdmin && (
                                <span className="admin-badge">
                                    ADMIN
                                </span>
                            )}


                            {/* LOGOUT */}

                            <button
                                className="nav-logout"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>

                        </>

                    ) : (

                        <>

                            <Link
                                to="/login"
                                className="nav-link"
                            >
                                Login
                            </Link>


                            <Link
                                to="/register"
                                className="nav-link"
                            >
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