import { useState } from "react";
import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "../services/orderService";

function Cart()
{

    const {
        cart,
        loading,
        updateCart,
        removeFromCart,
        clearCart
    } = useCart();

    const [error, setError] = useState("");

    const navigate = useNavigate();

    // ---------------------------------------------------------
    // UPDATE QUANTITY
    // ---------------------------------------------------------

    const handleQuantityChange = async (
        bookId,
        currentQuantity,
        change
    ) => {

        const newQuantity =
            currentQuantity + change;

        if (newQuantity < 1) {
            return;
        }

        setError("");

        const result =
            await updateCart(
                bookId,
                newQuantity
            );

        if (!result.success) {

            setError(
                result.error?.response?.data?.message ||
                "Unable to update cart."
            );
        }
    };

    // ---------------------------------------------------------
    // REMOVE
    // ---------------------------------------------------------

    const handleRemove = async (bookId) => {

        setError("");

        const result =
            await removeFromCart(bookId);

        if (!result.success) {

            setError(
                result.error?.response?.data?.message ||
                "Unable to remove item."
            );
        }
    };

    // ---------------------------------------------------------
    // CLEAR
    // ---------------------------------------------------------

    const handleClearCart = async () => {

        const confirmed =
            window.confirm(
                "Are you sure you want to clear your cart?"
            );

        if (!confirmed) {
            return;
        }

        setError("");

        const result =
            await clearCart();

        if (!result.success) {

            setError(
                result.error?.response?.data?.message ||
                "Unable to clear cart."
            );
        }
    };

    // ---------------------------------------------------------
    // LOADING
    // ---------------------------------------------------------

    if (loading) {

        return (
            <div className="page-message">
                <p>Loading cart...</p>
            </div>
        );
    }

    // ---------------------------------------------------------
    // EMPTY CART
    // ---------------------------------------------------------

    if (
        !cart ||
        !cart.items ||
        cart.items.length === 0
    ) {

        return (
            <div className="cart-container">

                <div className="cart-header">
                    <h2>Your Cart</h2>
                </div>

                <div className="empty-cart">

                    <div className="empty-cart-icon">
                        🛒
                    </div>

                    <h3>Your cart is empty</h3>

                    <p>
                        Browse our books and add
                        something you like.
                    </p>

                    <Link
                        to="/books"
                        className="primary-button continue-shopping"
                    >
                        Continue Shopping
                    </Link>

                </div>

            </div>
        );
    }

    const handlePlaceOrder = async () => {

        if (!cart?.items || cart.items.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to place this order?"
        );

        if (!confirmed) {
            return;
        }

        try {

            const order = await placeOrder();

            alert(
                `Order placed successfully!\nOrder ID: ${order.orderId}`
            );

            // Cart is cleared by backend after successful order
            setCart({
                cartId: cart.cartId,
                items: [],
                totalAmount: 0
            });

            navigate(`/orders/${order.orderId}`);

        } catch (error) {

            console.error(
                "Place order error:",
                error
            );

            const message =
                error.response?.data?.message ||
                "Unable to place order.";

            alert(message);
        }
    };

    return (
        <div className="cart-container">

            <div className="cart-header">

                <div>
                    <h2>Your Cart</h2>

                    <p>
                        Review your selected books
                    </p>
                </div>

                <button
                    className="clear-cart-button"
                    onClick={handleClearCart}
                >
                    Clear Cart
                </button>

            </div>

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            <div className="cart-layout">

                {/* CART ITEMS */}

                <div className="cart-items">

                    {cart.items.map(item => (

                        <div
                            className="cart-item"
                            key={item.bookId}
                        >

                            <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="cart-item-image"
                            />

                            <div className="cart-item-info">

                                <h3>
                                    {item.title}
                                </h3>

                                <p className="cart-item-author">
                                    by {item.author}
                                </p>

                                <p className="cart-item-price">
                                    ₹{item.unitPrice}
                                </p>

                                <div className="cart-item-controls">

                                    <div className="quantity-control">

                                        <button
                                            onClick={() =>
                                                handleQuantityChange(
                                                    item.bookId,
                                                    item.quantity,
                                                    -1
                                                )
                                            }
                                            disabled={
                                                item.quantity <= 1
                                            }
                                        >
                                            −
                                        </button>

                                        <span>
                                            {item.quantity}
                                        </span>

                                        <button
                                            onClick={() =>
                                                handleQuantityChange(
                                                    item.bookId,
                                                    item.quantity,
                                                    1
                                                )
                                            }
                                        >
                                            +
                                        </button>

                                    </div>

                                    <button
                                        className="remove-item-button"
                                        onClick={() =>
                                            handleRemove(
                                                item.bookId
                                            )
                                        }
                                    >
                                        Remove
                                    </button>

                                </div>

                            </div>

                            <div className="cart-item-subtotal">

                                <span>
                                    Subtotal
                                </span>

                                <strong>
                                    ₹{item.subtotal}
                                </strong>

                            </div>

                        </div>

                    ))}

                </div>

                {/* SUMMARY */}

                <div className="cart-summary">

                    <h3>Order Summary</h3>

                    <div className="summary-row">

                        <span>
                            Items
                        </span>

                        <span>
                            {cart.items.reduce(
                                (total, item) =>
                                    total + item.quantity,
                                0
                            )}
                        </span>

                    </div>

                    <div className="summary-row total-row">

                        <span>
                            Total
                        </span>

                        <strong>
                            ₹{cart.totalAmount}
                        </strong>

                    </div>

                    <button
                        className="place-order-button"
                        onClick={handlePlaceOrder}
                    >
                         Place Order
                    </button>

                    <Link
                        to="/books"
                        className="continue-shopping-link"
                    >
                        ← Continue Shopping
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Cart;