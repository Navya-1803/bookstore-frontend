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

            {book.imageUrl && (
                <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="book-image"
                />
            )}

            <div className="book-card-content">

                <h3>{book.title}</h3>

                <p className="book-author">
                    by {book.author}
                </p>

                <p className="book-category">
                    {book.category}
                </p>

                <p className="book-description">
                    {book.description}
                </p>

                <p className="book-price">
                    ₹{book.price}
                </p>

                <p>
                    Stock: {book.quantity}
                </p>

                {isAdmin ? (

                    /* Admin Actions */

                    <div className="book-actions">

                        <Link
                            to={`/books/edit/${book.id}`}
                            className="edit-button"
                        >
                            Edit
                        </Link>

                        <button
                            onClick={() => onDelete(book.id)}
                            className="delete-button"
                        >
                            Delete
                        </button>

                    </div>

                ) : (

                    /*User Actions*/

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
                        >
                            🛒 Add to Cart
                        </button>

                        <button
                            onClick={handleBuyNow}
                            className="buy-button"
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