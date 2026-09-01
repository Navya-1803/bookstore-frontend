import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProtectedRoute from "./routes/ProtectedRoute";
import Layout from "./components/Layout";
import Books from "./pages/Books";
import AddBook from "./pages/AddBook";
import EditBook from "./pages/EditBook";
import AdminRoute from "./routes/AdminRoute";
import BookDetails from "./pages/BookDetails";

function App() {

    return (
        <BrowserRouter>

            <Layout>

                <Routes>

                    <Route
                        path="/"
                        element={
                            <Navigate to="/login" />
                        }
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/books"
                        element={
                            <ProtectedRoute>
                                <Books />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/books/add"
                        element={
                            <AdminRoute>
                                <AddBook />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/books/edit/:id"
                        element={
                            <AdminRoute>
                                <EditBook />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/books/:id"
                        element={
                            <ProtectedRoute>
                                <BookDetails />
                            </ProtectedRoute>
                        }
                    />

                </Routes>

            </Layout>

        </BrowserRouter>
    );
}

export default App;