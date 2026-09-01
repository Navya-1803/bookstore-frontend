import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function EditBook() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        author: "",
        description: "",
        price: "",
        quantity: "",
        category: "",
        imageUrl: "",
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchBook = async () => {

            try {

                const response =
                    await api.get(`/books/${id}`);

                const book = response.data;

                setFormData({
                    title: book.title,
                    author: book.author,
                    description: book.description || "",
                    price: book.price,
                    quantity: book.quantity,
                    category: book.category,
                    imageUrl: book.imageUrl || "",
                });

            } catch (error) {

                console.error(
                    "Error fetching book:",
                    error
                );

                setError("Unable to load book.");

            } finally {

                setLoading(false);
            }
        };

        fetchBook();

    }, [id]);

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        try {

            await api.put(`/books/${id}`, {
                ...formData,
                price: Number(formData.price),
                quantity: Number(formData.quantity),
            });

            navigate("/books");

        } catch (error) {

            console.error(
                "Update book error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to update book."
            );
        }
    };

    if (loading) {
        return <p>Loading book...</p>;
    }

    if (error && !formData.title) {
        return <p>{error}</p>;
    }

    return (
        <div className="form-card">

            <h2>Edit Book</h2>

            <form onSubmit={handleSubmit}>

                <div className="form-group">
                    <label>Title</label>

                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Author</label>

                    <input
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>

                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-row">

                    <div className="form-group">
                        <label>Price</label>

                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            min="0.01"
                            step="0.01"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Quantity</label>

                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            min="0"
                            required
                        />
                    </div>

                </div>

                <div className="form-group">
                    <label>Category</label>

                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Image URL</label>

                    <input
                        type="url"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                    />
                </div>

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    className="primary-button"
                >
                    Update Book
                </button>

            </form>

        </div>
    );
}

export default EditBook;