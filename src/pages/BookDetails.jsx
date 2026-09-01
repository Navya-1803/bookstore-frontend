import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function BookDetails() {

    const { id } = useParams();
    const { user } = useAuth();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const isAdmin = user?.role === "ADMIN";

    useEffect(() => {

        const fetchBook = async () => {

            try {

                const response =
                    await api.get(`/books/${id}`);

                setBook(response.data);

            } catch (error) {

                console.error(
                    "Book details error:",
                    error
                );

                setError("Unable to load book details.");

            } finally {

                setLoading(false);
            }
        };

        fetchBook();

    }, [id]);

    const handleWishlist = () => {
        alert(`"${book.title}" added to wishlist.`);
    };

    const handleCart = () => {
        alert(`"${book.title}" added to cart.`);
    };

    const handleBuyNow = () => {
        alert(`Buy Now selected for "${book.title}".`);
    };

    if (loading) {
        return (
            <div className="book-details-container">
                <p>Loading book details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="book-details-container">

                <p className="error-message">
                    {error}
                </p>

                <Link to="/books">
                    ← Back to Books
                </Link>

            </div>
        );
    }

    if (!book) {
        return (
            <div className="book-details-container">

                <h2>Book not found</h2>

                <Link to="/books">
                    ← Back to Books
                </Link>

            </div>
        );
    }

    return (
        <div className="book-details-container">

            <Link
                to="/books"
                className="back-link"
            >
                ← Back to Books
            </Link>

            <div className="book-details-card">

                <div className="book-details-image-section">

                    {book.imageUrl ? (

                        <img
                            src={book.imageUrl}
                            alt={book.title}
                            className="book-details-image"
                        />

                    ) : (

                        <div className="book-image-placeholder">
                            📚
                        </div>

                    )}

                </div>

                <div className="book-details-content">

                    <p className="book-details-category">
                        {book.category}
                    </p>

                    <h1>{book.title}</h1>

                    <p className="book-details-author">
                        by {book.author}
                    </p>

                    <p className="book-details-description">
                        {book.description}
                    </p>

                    <div className="book-details-price">
                        ₹{book.price}
                    </div>

                    <p className="book-details-stock">
                        {book.quantity > 0
                            ? `In Stock (${book.quantity} available)`
                            : "Out of Stock"
                        }
                    </p>

                    {isAdmin ? (

                        <div className="book-details-admin-actions">

                            <Link
                                to={`/books/edit/${book.id}`}
                                className="edit-button"
                            >
                                Edit Book
                            </Link>

                        </div>

                    ) : (

                        <div className="book-details-user-actions">

                            <button
                                onClick={handleWishlist}
                                className="wishlist-button"
                            >
                                ❤️ Add to Wishlist
                            </button>

                            <button
                                onClick={handleCart}
                                className="cart-button"
                                disabled={book.quantity <= 0}
                            >
                                🛒 Add to Cart
                            </button>

                            <button
                                onClick={handleBuyNow}
                                className="buy-button"
                                disabled={book.quantity <= 0}
                            >
                                ⚡ Buy Now
                            </button>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

export default BookDetails;