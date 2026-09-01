import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function BookCard({ book, onDelete }) {

    const { user } = useAuth();

    const isAdmin = user?.role === "ADMIN";

    const handleWishlist = () => {
        alert(`"${book.title}" added to wishlist.`);
    };

    const handleCart = () => {
        alert(`"${book.title}" added to cart.`);
    };

    const handleBuyNow = () => {
        alert(`Buy Now selected for "${book.title}".`);
    };

    return (
        <div className="book-card">

            {book.imageUrl ? (

                <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="book-image"
                />

            ) : (

                <div className="book-image-placeholder">
                    📚
                </div>

            )}


            <div className="book-card-content">

                <p className="book-category">
                    {book.category}
                </p>

                <h3>{book.title}</h3>

                <p className="book-author">
                    by {book.author}
                </p>

                <p className="book-description">
                    {book.description}
                </p>

                <p className="book-price">
                    ₹{book.price}
                </p>

                <p className="book-stock">
                    {book.quantity > 0
                        ? `Stock: ${book.quantity}`
                        : "Out of Stock"
                    }
                </p>


                {/* ================= VIEW DETAILS ================= */}

                <Link
                    to={`/books/${book.id}`}
                    className="view-details-button"
                >
                    View Details
                </Link>


                {/* ================= ADMIN ================= */}

                {isAdmin ? (

                    <div className="book-actions">

                        <Link
                            to={`/books/edit/${book.id}`}
                            className="edit-button"
                        >
                            Edit
                        </Link>

                        <button
                            onClick={() =>
                                onDelete(book.id)
                            }
                            className="delete-button"
                        >
                            Delete
                        </button>

                    </div>

                ) : (

                    /* ================= USER ================= */

                    <div className="user-book-actions">

                        <button
                            onClick={handleWishlist}
                            className="wishlist-button"
                        >
                            ❤️ Wishlist
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
    );
}

export default BookCard;