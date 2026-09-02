import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
    getAdminOrderById,
    updateOrderStatus
} from "../services/orderService";

function AdminOrderDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadOrder();
    }, [id]);

    const loadOrder = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getAdminOrderById(id);

            setOrder(data);
            setSelectedStatus(data.status);

        } catch (error) {

            console.error(
                "Admin order details error:",
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

    const handleStatusUpdate = async () => {

        if (!selectedStatus) {
            return;
        }

        if (selectedStatus === order.status) {
            alert("Please select a different status.");
            return;
        }

        const confirmed = window.confirm(
            `Change order status from ${order.status} to ${selectedStatus}?`
        );

        if (!confirmed) {
            return;
        }

        try {

            setUpdating(true);

            const updatedOrder =
                await updateOrderStatus(
                    order.orderId,
                    selectedStatus
                );

            setOrder(updatedOrder);
            setSelectedStatus(updatedOrder.status);

            alert(
                "Order status updated successfully."
            );

        } catch (error) {

            console.error(
                "Status update error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to update order status."
            );

            // Reload in case backend rejected the transition
            loadOrder();

        } finally {

            setUpdating(false);
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
                    to="/admin/orders"
                    className="back-orders-link"
                >
                    ← Back to All Orders
                </Link>

            </div>
        );
    }

    if (!order) {
        return null;
    }

    return (
        <div className="order-details-page">

            {/* HEADER */}

            <div className="order-details-top">

                <div>

                    <Link
                        to="/admin/orders"
                        className="back-orders-link"
                    >
                        ← All Orders
                    </Link>

                    <h1>
                        Order #{order.orderId}
                    </h1>

                    <p>
                        Customer ID:{" "}
                        {order.customerId}
                    </p>

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

            {/* ADMIN STATUS MANAGEMENT */}

            <div className="admin-status-management">

                <div>

                    <h2>
                        ⚙️ Manage Order Status
                    </h2>

                    <p>
                        Current status:{" "}
                        <strong>
                            {order.status}
                        </strong>
                    </p>

                </div>

                <div className="status-update-controls">

                    <select
                        value={selectedStatus}
                        onChange={(e) =>
                            setSelectedStatus(
                                e.target.value
                            )
                        }
                        disabled={
                            order.status === "DELIVERED" ||
                            order.status === "CANCELLED" ||
                            updating
                        }
                    >

                        <option value="PENDING">
                            PENDING
                        </option>

                        <option value="CONFIRMED">
                            CONFIRMED
                        </option>

                        <option value="SHIPPED">
                            SHIPPED
                        </option>

                        <option value="DELIVERED">
                            DELIVERED
                        </option>

                        <option value="CANCELLED">
                            CANCELLED
                        </option>

                    </select>

                    <button
                        className="update-status-button"
                        onClick={handleStatusUpdate}
                        disabled={
                            updating ||
                            selectedStatus === order.status ||
                            order.status === "DELIVERED" ||
                            order.status === "CANCELLED"
                        }
                    >
                        {updating
                            ? "Updating..."
                            : "Update Status"}
                    </button>

                </div>

                {(order.status === "DELIVERED" ||
                    order.status === "CANCELLED") && (

                    <p className="status-locked-message">

                        {order.status === "DELIVERED"
                            ? "Delivered orders cannot be changed."
                            : "Cancelled orders cannot be changed."}

                    </p>

                )}

            </div>

            {/* ORDER ITEMS */}

            <div className="order-details-section">

                <h2>
                    📚 Ordered Books
                </h2>

                <div className="order-details-items">

                    {order.items?.map((item) => (

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

            {/* CUSTOMER / DELIVERY INFORMATION */}

            <div className="order-details-grid">

                <div className="order-details-section">

                    <h2>
                        👤 Customer
                    </h2>

                    <p>
                        Customer ID:{" "}
                        {order.customerId}
                    </p>

                    <p>
                        Phone:{" "}
                        {order.phoneNumber}
                    </p>

                </div>

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

            </div>

            {/* DELIVERY PREFERENCE */}

            <div className="order-details-section">

                <h2>
                    🚚 Delivery Preference
                </h2>

                <p>
                    {order.deliveryPreference}
                </p>

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

            {/* BACK BUTTON */}

            <div className="order-actions">

                <button
                    className="continue-shopping-button"
                    onClick={() =>
                        navigate("/admin/orders")
                    }
                >
                    ← Back to All Orders
                </button>

            </div>

        </div>
    );
}

export default AdminOrderDetails;