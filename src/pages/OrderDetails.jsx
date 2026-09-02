import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

import {
    getOrderById,
    cancelOrder
} from "../services/orderService";

function OrderDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadOrder();
    }, [id]);

    const loadOrder = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getOrderById(id);

            setOrder(data);

        } catch (error) {

            console.error(
                "Order details error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load order."
            );

        } finally {

            setLoading(false);
        }
    };

    const handleCancelOrder = async () => {

        const confirmed =
            window.confirm(
                "Are you sure you want to cancel this order?"
            );

        if (!confirmed) {
            return;
        }

        try {

            const updatedOrder =
                await cancelOrder(id);

            setOrder(updatedOrder);

            alert(
                "Order cancelled successfully."
            );

        } catch (error) {

            console.error(
                "Cancel order error:",
                error
            );

            const message =
                error.response?.data?.message ||
                "Unable to cancel order.";

            alert(message);
        }
    };

    if (loading) {

        return (
            <div className="order-details-page">

                <div className="orders-loading">
                    <h3>
                        Loading order...
                    </h3>
                </div>

            </div>
        );
    }

    if (error) {

        return (
            <div className="order-details-page">

                <div className="orders-error">
                    {error}
                </div>

                <Link
                    to="/orders"
                    className="back-orders-button"
                >
                    ← Back to Orders
                </Link>

            </div>
        );
    }

    if (!order) {
        return null;
    }

    return (
        <div className="order-details-page">

            <div className="order-details-top">

                <div>

                    <Link
                        to="/orders"
                        className="back-orders-link"
                    >
                        ← My Orders
                    </Link>

                    <h1>
                        Order #{order.orderId}
                    </h1>

                    <p>
                        Placed on{" "}
                        {new Date(
                            order.orderDate
                        ).toLocaleString()}
                    </p>

                </div>

                <span
                    className={`order-status large-status status-${order.status.toLowerCase()}`}
                >
                    {order.status}
                </span>

            </div>

            {/* ORDER STATUS */}

            <div className="order-status-section">

                <h2>
                    Order Status
                </h2>

                <div className="status-progress">

                    <div
                        className={
                            order.status === "PENDING" ||
                            order.status === "CONFIRMED" ||
                            order.status === "SHIPPED" ||
                            order.status === "DELIVERED"
                                ? "status-step active"
                                : "status-step"
                        }
                    >
                        <span>1</span>
                        <p>Pending</p>
                    </div>

                    <div
                        className={
                            order.status === "CONFIRMED" ||
                            order.status === "SHIPPED" ||
                            order.status === "DELIVERED"
                                ? "status-step active"
                                : "status-step"
                        }
                    >
                        <span>2</span>
                        <p>Confirmed</p>
                    </div>

                    <div
                        className={
                            order.status === "SHIPPED" ||
                            order.status === "DELIVERED"
                                ? "status-step active"
                                : "status-step"
                        }
                    >
                        <span>3</span>
                        <p>Shipped</p>
                    </div>

                    <div
                        className={
                            order.status === "DELIVERED"
                                ? "status-step active"
                                : "status-step"
                        }
                    >
                        <span>4</span>
                        <p>Delivered</p>
                    </div>

                </div>

                {order.status === "CANCELLED" && (

                    <div className="cancelled-message">
                        ❌ This order has been cancelled.
                    </div>

                )}

            </div>

            {/* ORDER ITEMS */}

            <div className="order-details-section">

                <h2>
                    Items in this Order
                </h2>

                <div className="order-details-items">

                    {order.items.map((item) => (

                        <div
                            className="order-detail-item"
                            key={item.bookId}
                        >

                            <img
                                src={item.imageUrl}
                                alt={item.title}
                                onError={(e) => {
                                    e.target.src =
                                        "https://via.placeholder.com/120x150?text=Book";
                                }}
                            />

                            <div className="order-detail-item-info">

                                <h3>
                                    {item.title}
                                </h3>

                                <p>
                                    by {item.author}
                                </p>

                                <p>
                                    ₹
                                    {Number(
                                        item.unitPrice
                                    ).toFixed(2)}
                                    {" "}×{" "}
                                    {item.quantity}
                                </p>

                            </div>

                            <strong>
                                ₹
                                {Number(
                                    item.subtotal
                                ).toFixed(2)}
                            </strong>

                        </div>

                    ))}

                </div>

            </div>

            {/* DELIVERY */}

            <div className="order-details-grid">

                <div className="order-details-section">

                    <h2>
                        📍 Delivery Address
                    </h2>

                    <p>
                        {order.houseNo}
                    </p>

                    <p>
                        {order.street}
                    </p>

                    <p>
                        {order.city}, {order.state}
                    </p>

                    <p>
                        {order.pincode}
                    </p>

                    <p>
                        {order.country}
                    </p>

                </div>

                <div className="order-details-section">

                    <h2>
                        📞 Contact
                    </h2>

                    <p>
                        {order.phoneNumber}
                    </p>

                    <h3>
                        Delivery Preference
                    </h3>

                    <p>
                        {order.deliveryPreference}
                    </p>

                </div>

            </div>

            {/* TOTAL */}

            <div className="order-total-section">

                <span>
                    Order Total
                </span>

                <strong>
                    ₹
                    {Number(
                        order.totalAmount
                    ).toFixed(2)}
                </strong>

            </div>

            {/* ACTIONS */}

            <div className="order-actions">

                {order.status === "PENDING" && (

                    <button
                        className="cancel-order-button"
                        onClick={handleCancelOrder}
                    >
                        Cancel Order
                    </button>

                )}

                <button
                    className="continue-shopping-button"
                    onClick={() =>
                        navigate("/books")
                    }
                >
                    Continue Shopping
                </button>

            </div>

        </div>
    );
}

export default OrderDetails;