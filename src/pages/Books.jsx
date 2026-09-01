import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import BookCard from "../components/BookCard";

function Books() {

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchBooks = async () => {

        try {

            const response =
                await api.get("/books");

            setBooks(response.data);

        } catch (error) {

            console.error("Error fetching books:", error);

            setError("Unable to load books.");

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this book?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await api.delete(`/books/${id}`);

            setBooks(
                books.filter(book => book.id !== id)
            );

        } catch (error) {

            console.error("Delete error:", error);

            setError("Unable to delete book.");
        }
    };

    if (loading) {
        return <p>Loading books...</p>;
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

                <Link
                    to="/books/add"
                    className="primary-button add-book-button"
                >
                    + Add Book
                </Link>

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
                        Add your first book to get started.
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