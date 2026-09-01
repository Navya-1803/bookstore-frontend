import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import BookCard from "../components/BookCard";
import { useAuth } from "../context/AuthContext";

function Books() {

    const { user } = useAuth();

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const isAdmin =
        user?.role === "ADMIN";

    // ---------------------------------------------------------
    // FETCH BOOKS
    // ---------------------------------------------------------

    const fetchBooks = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get("/books");

            setBooks(response.data);

        } catch (error) {

            console.error(
                "Error fetching books:",
                error
            );

            setError(
                "Unable to load books."
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    // ---------------------------------------------------------
    // DELETE BOOK
    // ---------------------------------------------------------

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this book?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await api.delete(
                `/books/${id}`
            );

            setBooks(
                books.filter(
                    book => book.id !== id
                )
            );

        } catch (error) {

            console.error(
                "Delete error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to delete book."
            );
        }
    };

    // ---------------------------------------------------------
    // LOADING
    // ---------------------------------------------------------

    if (loading) {

        return (
            <div className="page-message">
                <p>Loading books...</p>
            </div>
        );
    }

    return (
        <div className="books-container">

            <div className="books-header">

                <div>
                    <h2>Bookstore</h2>

                    <p>
                        Browse our collection of books
                    </p>
                </div>

                {isAdmin && (
                    <Link
                        to="/books/add"
                        className="primary-button add-book-button"
                    >
                        + Add Book
                    </Link>
                )}

            </div>

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            {books.length === 0 ? (

                <div className="empty-books">

                    <h3>No books available</h3>

                    <p>
                        {isAdmin
                            ? "Add your first book to get started."
                            : "There are no books available right now."
                        }
                    </p>

                </div>

            ) : (

                <div className="books-grid">

                    {books.map(book => (

                        <BookCard
                            key={book.id}
                            book={book}
                            onDelete={handleDelete}
                        />

                    ))}

                </div>
            )}

        </div>
    );
}

export default Books;