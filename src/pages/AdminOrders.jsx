import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getAllOrders } from "../services/orderService";

function AdminOrders() {

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

            const data = await getAllOrders();

            setOrders(data);

        } catch (error) {

            console.error(
                "Admin orders error:",
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
                    <h3>
                        Loading all orders...
                    </h3>
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
                    <h1>
                        📦 All Orders
                    </h1>

                    <p>
                        Manage customer orders
                    </p>
                </div>

                <span className="orders-count">
                    {orders.length}{" "}
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
                        No orders found
                    </h2>

                    <p>
                        There are currently no customer orders.
                    </p>

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
                                        Customer ID:{" "}
                                        {order.customerId}
                                    </p>

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

                                {order.items?.map((item) => (

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
                                                Qty:{" "}
                                                {item.quantity}
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
                                    to={`/admin/orders/${order.orderId}`}
                                    className="view-order-button"
                                >
                                    Manage Order
                                </Link>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default AdminOrders;