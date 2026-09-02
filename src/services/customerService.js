import axios from "axios";

const API_URL = "http://localhost:8080/api/customers";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };
};

export const getCustomerDetails = async () => {
    const response = await axios.get(
        `${API_URL}/details`,
        getAuthHeaders()
    );

    return response.data;
};

export const updateCustomerDetails = async (customerData) => {
    const response = await axios.put(
        `${API_URL}/details`,
        customerData,
        getAuthHeaders()
    );

    return response.data;
};