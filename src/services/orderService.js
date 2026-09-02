import axios from "axios";

const API_URL = "http://localhost:8080/api/orders";

const getAuthConfig = () => {
    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    };
};

// ---------------------------------------------------------
// PLACE ORDER
// ---------------------------------------------------------

export const placeOrder = async () => {

    const response = await axios.post(
        API_URL,
        {},
        getAuthConfig()
    );

    return response.data;
};

// ---------------------------------------------------------
// GET MY ORDERS
// ---------------------------------------------------------

export const getMyOrders = async () => {

    const response = await axios.get(
        API_URL,
        getAuthConfig()
    );

    return response.data;
};

// ---------------------------------------------------------
// GET ONE ORDER
// ---------------------------------------------------------

export const getOrderById = async (orderId) => {

    const response = await axios.get(
        `${API_URL}/${orderId}`,
        getAuthConfig()
    );

    return response.data;
};

// =========================================================
// ADMIN - GET ORDER BY ID
// =========================================================

export const getAdminOrderById = async (orderId) => {

    const response = await axios.get(
        `${API_URL}/admin/${orderId}`,
        getAuthConfig()
    );

    return response.data;
};

// ---------------------------------------------------------
// CANCEL ORDER
// ---------------------------------------------------------

export const cancelOrder = async (orderId) => {

    const response = await axios.put(
        `${API_URL}/${orderId}/cancel`,
        {},
        getAuthConfig()
    );

    return response.data;
};

// ---------------------------------------------------------
// ADMIN - GET ALL ORDERS
// ---------------------------------------------------------

export const getAllOrders = async () => {

    const response = await axios.get(
        `${API_URL}/all`,
        getAuthConfig()
    );

    return response.data;
};


// ---------------------------------------------------------
// ADMIN - UPDATE ORDER STATUS
// ---------------------------------------------------------

export const updateOrderStatus = async (orderId, status) => {

    const response = await axios.put(
        `${API_URL}/${orderId}/status`,
        {
            status: status
        },
        getAuthConfig()
    );

    return response.data;
};