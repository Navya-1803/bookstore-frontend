import axios from "axios";

const API_URL = "http://localhost:8080/api/wishlist";

const getAuthConfig = () => {
    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    };
};

export const getWishlist = async () => {
    const response = await axios.get(
        API_URL,
        getAuthConfig()
    );

    return response.data;
};

export const addToWishlist = async (bookId) => {
    const response = await axios.post(
        `${API_URL}/add/${bookId}`,
        {},
        getAuthConfig()
    );

    return response.data;
};

export const removeFromWishlist = async (bookId) => {
    const response = await axios.delete(
        `${API_URL}/remove/${bookId}`,
        getAuthConfig()
    );

    return response.data;
};