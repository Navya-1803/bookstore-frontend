import { useEffect, useState } from "react";
import api from "./services/api";

function App() {

    const [message, setMessage] = useState("");

    useEffect(() => {
        api.get("/health")
            .then(response => {
                setMessage(response.data);
            })
            .catch(error => {
                console.error("Backend connection error:", error);
                setMessage("Unable to connect to backend");
            });
    }, []);

    return (
        <div>
            <h1>Bookstore E-Commerce</h1>
            <p>{message}</p>
        </div>
    );
}

export default App;