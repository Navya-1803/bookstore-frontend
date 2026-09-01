import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import api from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {

    const {
        user,
        isAuthenticated
    } = useAuth();

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);

    const isUser =
        isAuthenticated &&
        user?.role === "USER";

    // ---------------------------------------------------------
    // LOAD CART
    // ---------------------------------------------------------

    const fetchCart = async () => {

        if (!isUser) {
            setCart(null);
            return;
        }

        try {

            setLoading(true);

            const response =
                await api.get("/cart");

            setCart(response.data);

        } catch (error) {

            console.error(
                "Error loading cart:",
                error
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        fetchCart();

    }, [isUser]);

    // ---------------------------------------------------------
    // ADD TO CART
    // ---------------------------------------------------------

    const addToCart = async (
        bookId,
        quantity = 1
    ) => {

        try {

            const response =
                await api.post(
                    "/cart/add",
                    {
                        bookId,
                        quantity
                    }
                );

            setCart(response.data);

            return {
                success: true,
                data: response.data
            };

        } catch (error) {

            console.error(
                "Add to cart error:",
                error
            );

            return {
                success: false,
                error
            };
        }
    };

    // ---------------------------------------------------------
    // UPDATE CART
    // ---------------------------------------------------------

    const updateCart = async (
        bookId,
        quantity
    ) => {

        try {

            const response =
                await api.put(
                    "/cart/update",
                    {
                        bookId,
                        quantity
                    }
                );

            setCart(response.data);

            return {
                success: true,
                data: response.data
            };

        } catch (error) {

            console.error(
                "Update cart error:",
                error
            );

            return {
                success: false,
                error
            };
        }
    };

    // ---------------------------------------------------------
    // REMOVE FROM CART
    // ---------------------------------------------------------

    const removeFromCart = async (bookId) => {

        try {

            const response =
                await api.delete(
                    `/cart/remove/${bookId}`
                );

            setCart(response.data);

            return {
                success: true,
                data: response.data
            };

        } catch (error) {

            console.error(
                "Remove cart item error:",
                error
            );

            return {
                success: false,
                error
            };
        }
    };

    // ---------------------------------------------------------
    // CLEAR CART
    // ---------------------------------------------------------

    const clearCart = async () => {

        try {

            await api.delete("/cart/clear");

            await fetchCart();

            return {
                success: true
            };

        } catch (error) {

            console.error(
                "Clear cart error:",
                error
            );

            return {
                success: false,
                error
            };
        }
    };

    // ---------------------------------------------------------
    // CART ITEM COUNT
    // ---------------------------------------------------------

    const cartItemCount =
        cart?.items?.reduce(
            (total, item) =>
                total + item.quantity,
            0
        ) || 0;

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                cartItemCount,
                fetchCart,
                addToCart,
                updateCart,
                removeFromCart,
                clearCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}