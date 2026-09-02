import { useEffect, useState } from "react";
import {
    getWishlist,
    removeFromWishlist
} from "../services/wishlistService";

function Wishlist() {

    const [wishlist, setWishlist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadWishlist();
    }, []);

    const loadWishlist = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getWishlist();

            setWishlist(data);

        } catch (error) {

            console.error("Wishlist error:", error);

            setError("Unable to load wishlist.");

        } finally {

            setLoading(false);
        }
    };

    const handleRemove = async (bookId) => {

        try {

            const updatedWishlist =
                await removeFromWishlist(bookId);

            setWishlist(updatedWishlist);

        } catch (error) {

            console.error(
                "Remove wishlist error:",
                error
            );

            alert("Unable to remove book from wishlist.");
        }
    };

    if (loading) {
        return (
            <div className="wishlist-loading">
                <div className="wishlist-spinner"></div>
                <p>Loading your wishlist...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="wishlist-error">
                <div className="wishlist-error-icon">⚠️</div>
                <h3>Oops!</h3>
                <p>{error}</p>
                <button
                    className="wishlist-retry-button"
                    onClick={loadWishlist}
                >
                    Try Again
                </button>
            </div>
        );
    }

    const items = wishlist?.items || [];

    return (
        <div className="wishlist-page">

            {/* Header */}
            <div className="wishlist-header">

                <div>
                    <h1>❤️ My Wishlist</h1>
                    <p className="wishlist-subtitle">
                        Books you've saved for later
                    </p>
                </div>

                <span className="wishlist-count">
                {items.length}{" "}
                    {items.length === 1 ? "Book" : "Books"}
            </span>

            </div>


            {/* Empty Wishlist */}
            {items.length === 0 ? (

                <div className="wishlist-empty">

                    <div className="wishlist-empty-icon">
                        🤍
                    </div>

                    <h2>Your wishlist is empty</h2>

                    <p>
                        Add books you love to your wishlist
                        and find them here later.
                    </p>

                    <a
                        href="/books"
                        className="wishlist-browse-button"
                    >
                        Browse Books
                    </a>

                </div>

            ) : (


                <div className="wishlist-grid">

                    {items.map((book) => (

                        <div
                            className="wishlist-card"
                            key={book.bookId}
                        >

                            {/* Book Image */}
                            <div className="wishlist-image-container">

                                <img
                                    src={book.imageUrl}
                                    className="wishlist-card-image"
                                    alt={book.title}
                                    onError={(e) => {
                                        e.target.src =
                                            "https://via.placeholder.com/300x400?text=Book";
                                    }}
                                />

                                <span className="wishlist-heart">
                                ❤️
                            </span>

                            </div>


                            {/* Book Details */}
                            <div className="wishlist-card-content">

                                <h3 className="wishlist-card-title">
                                    {book.title}
                                </h3>

                                <p className="wishlist-card-author">
                                    by {book.author}
                                </p>

                                <p className="wishlist-card-price">
                                    ₹{book.price}
                                </p>


                                {/* Actions */}
                                <div className="wishlist-actions">

                                    <button
                                        className="wishlist-cart-button"
                                    >
                                        🛒 Add to Cart
                                    </button>

                                    <button
                                        className="wishlist-remove-button"
                                        onClick={() =>
                                            handleRemove(book.bookId)
                                        }
                                    >
                                        🗑️ Remove
                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default Wishlist;