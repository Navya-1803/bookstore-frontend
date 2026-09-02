import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Books from "./pages/Books";
import Cart from "./pages/Cart";
import AddBook from "./pages/AddBook";
import EditBook from "./pages/EditBook";
import ProtectedRoute from "./routes/ProtectedRoute";
import Layout from "./components/Layout";
import Wishlist from "./pages/Wishlist";
import CustomerDetails from "./pages/CustomerDetails.jsx";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import AdminOrders from "./pages/AdminOrders";
import AdminOrderDetails from "./pages/AdminOrderDetails";

function App() {

    return (
        <BrowserRouter>

            <Layout>

                <Routes>

                    {/* HOME */}

                    <Route
                        path="/"
                        element={
                            <Navigate to="/login" />
                        }
                    />

                    {/* AUTH */}

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    {/* PROFILE */}

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />

                    {/* BOOKS */}

                    <Route
                        path="/books"
                        element={
                            <ProtectedRoute>
                                <Books />
                            </ProtectedRoute>
                        }
                    />

                    {/* ADMIN BOOK MANAGEMENT */}

                    <Route
                        path="/books/add"
                        element={
                            <ProtectedRoute>
                                <AddBook />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/books/edit/:id"
                        element={
                            <ProtectedRoute>
                                <EditBook />
                            </ProtectedRoute>
                        }
                    />

                    {/* CART */}

                    <Route
                        path="/cart"
                        element={
                            <ProtectedRoute>
                                <Cart />
                            </ProtectedRoute>
                        }
                    />

                    {/* FALLBACK */}

                    <Route
                        path="*"
                        element={
                            <Navigate to="/books" />
                        }
                    />

                    <Route
                        path="/wishlist"
                        element={<Wishlist />}
                    />

                    <Route
                        path="/customer-details"
                        element={<CustomerDetails />}
                    />

                    <Route
                        path="/orders"
                        element={
                            <ProtectedRoute>
                                <Orders />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/orders/:id"
                        element={
                            <ProtectedRoute>
                                <OrderDetails />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/orders"
                        element={
                            <ProtectedRoute>
                                <AdminOrders />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/orders/:id"
                        element={
                            <ProtectedRoute>
                                <AdminOrderDetails />
                            </ProtectedRoute>
                        }
                    />

                </Routes>

            </Layout>

        </BrowserRouter>
    );
}

export default App;