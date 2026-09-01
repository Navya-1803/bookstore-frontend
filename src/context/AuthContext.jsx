import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(
        !!localStorage.getItem("token")
    );

    useEffect(() => {

        const loadUser = async () => {

            if (!token) {
                setLoading(false);
                return;
            }

            try {

                const response =
                    await api.get("/users/profile");

                setUser(response.data);

            } catch (error) {

                console.error(
                    "AuthContext profile error:",
                    error
                );

                localStorage.removeItem("token");
                setToken(null);
                setUser(null);

            } finally {

                setLoading(false);
            }
        };

        loadUser();

    }, [token]);

    const login = (newToken, newUser) => {

        localStorage.setItem("token", newToken);

        setToken(newToken);
        setUser(newUser);
        setLoading(false);
    };

    const logout = () => {

        localStorage.removeItem("token");

        setToken(null);
        setUser(null);
        setLoading(false);
    };

    const isAuthenticated =
        !!token && !!user;

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                setUser,
                loading,
                isAuthenticated,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}