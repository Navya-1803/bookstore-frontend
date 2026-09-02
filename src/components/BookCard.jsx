import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { addToWishlist } from "../services/wishlistService";

function BookCard({ book, onDelete }) {

    const { user } = useAuth();

    const {
        addToCart
    } = useCart();

    const isAdmin =
        user?.role === "ADMIN";

    const isUser =
        user?.role === "USER";

    // ---------------------------------------------------------
    // ADD TO CART
    // ---------------------------------------------------------

    const handleAddToCart = async () => {

        const result =
            await addToCart(book.id, 1);

        if (result.success) {

            alert(
                `${book.title} added to cart`
            );

        } else {

            const message =
                result.error?.response?.data?.message ||
                "Unable to add book to cart.";

            alert(message);
        }
    };

    /*Add to wishlist*/

      const handleAddToWishlist = async () => {

        try {

            await addToWishlist(book.id);

            alert("Book added to wishlist ❤️");

        } catch (error) {

            console.error(
                "Wishlist error:",
                error
            );

            if (error.response?.status === 401) {

                alert(
                    "Please login to add books to wishlist."
                );

            } else if (error.response?.status === 403) {

                alert(
                    "Only users can add books to wishlist."
                );

            } else {

                alert(
                    "Unable to add book to wishlist."
                );
            }
        }
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

                <p
                    className={
                        book.quantity > 0
                            ? "book-stock"
                            : "book-stock out-of-stock"
                    }
                >
                    {book.quantity > 0
                        ? `${book.quantity} available`
                        : "Out of stock"}
                </p>

                {/* USER ACTIONS */}

                {isUser && (
                    <div className="customer-book-actions">

                        <button
                            className="btn btn-outline-danger w-100 mb-2"
                            onClick={handleAddToWishlist}
                        >
                            Add to Wishlist
                        </button>

                        <button
                            className="cart-button"
                            onClick={handleAddToCart}
                            disabled={book.quantity === 0}
                        >
                            Add to Cart
                        </button>

                        <button
                            className="buy-button"
                            onClick={() =>
                                alert(
                                    "Buy Now functionality coming soon."
                                )
                            }
                            disabled={book.quantity === 0}
                        >
                            Buy Now
                        </button>

                    </div>
                )}

                {/* ADMIN ACTIONS */}

                {isAdmin && (
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
                )}

            </div>
        </div>
    );

}

export default BookCard;