import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMyOrders } from "../services/orderService";

function Orders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getMyOrders();

            setOrders(data);

        } catch (error) {

            console.error(
                "Orders error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load orders."
            );

        } finally {

            setLoading(false);
        }
    };

    if (loading) {

        return (
            <div className="orders-page">

                <div className="orders-loading">
                    <h3>Loading your orders...</h3>
                </div>

            </div>
        );
    }

    if (error) {

        return (
            <div className="orders-page">

                <div className="orders-error">
                    {error}
                </div>

            </div>
        );
    }

    return (
        <div className="orders-page">

            <div className="orders-header">

                <div>
                    <h1>📦 My Orders</h1>

                    <p>
                        View and manage your orders
                    </p>
                </div>

                <span className="orders-count">
                    {orders.length}
                    {" "}
                    {orders.length === 1
                        ? "Order"
                        : "Orders"}
                </span>

            </div>

            {orders.length === 0 ? (

                <div className="empty-orders">

                    <div className="empty-orders-icon">
                        📦
                    </div>

                    <h2>
                        No orders yet
                    </h2>

                    <p>
                        You haven't placed any orders yet.
                    </p>

                    <Link
                        to="/books"
                        className="browse-books-button"
                    >
                        Browse Books
                    </Link>

                </div>

            ) : (

                <div className="orders-list">

                    {orders.map((order) => (

                        <div
                            className="order-card"
                            key={order.orderId}
                        >

                            <div className="order-card-header">

                                <div>
                                    <h3>
                                        Order #{order.orderId}
                                    </h3>

                                    <p>
                                        {new Date(
                                            order.orderDate
                                        ).toLocaleString()}
                                    </p>
                                </div>

                                <span
                                    className={`order-status status-${order.status.toLowerCase()}`}
                                >
                                    {order.status}
                                </span>

                            </div>

                            <div className="order-items-preview">

                                {order.items.map((item) => (

                                    <div
                                        className="order-item-preview"
                                        key={item.bookId}
                                    >

                                        <img
                                            src={item.imageUrl}
                                            alt={item.title}
                                            onError={(e) => {
                                                e.target.src =
                                                    "https://via.placeholder.com/80x100?text=Book";
                                            }}
                                        />

                                        <div>

                                            <h4>
                                                {item.title}
                                            </h4>

                                            <p>
                                                {item.author}
                                            </p>

                                            <span>
                                                Qty: {item.quantity}
                                            </span>

                                        </div>

                                    </div>

                                ))}

                            </div>

                            <div className="order-card-footer">

                                <strong>
                                    Total: ₹
                                    {Number(
                                        order.totalAmount
                                    ).toFixed(2)}
                                </strong>

                                <Link
                                    to={`/orders/${order.orderId}`}
                                    className="view-order-button"
                                >
                                    View Details
                                </Link>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default Orders;