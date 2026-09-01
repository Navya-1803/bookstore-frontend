import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import BookCard from "../components/BookCard";
import { useAuth } from "../context/AuthContext";

function Books() {

    const { user } = useAuth();

    const [books, setBooks] = useState([]);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [sortBy, setSortBy] = useState("id");
    const [direction, setDirection] = useState("asc");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const isAdmin = user?.role === "ADMIN";

    /*
     * Get unique categories from the books returned
     * by the backend.
     */
    const categories = [
        ...new Set(
            books
                .map(book => book.category)
                .filter(Boolean)
        )
    ];

    const fetchBooks = async () => {

        try {

            setLoading(true);
            setError("");

            const params = {};

            if (search.trim()) {
                params.search = search.trim();
            }

            if (category) {
                params.category = category;
            }

            if (sortBy) {
                params.sortBy = sortBy;
            }

            if (direction) {
                params.direction = direction;
            }

            const response =
                await api.get("/books", {
                    params
                });

            setBooks(response.data);

        } catch (error) {

            console.error(
                "Error fetching books:",
                error
            );

            setError("Unable to load books.");

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        const timer = setTimeout(() => {
            fetchBooks();
        }, 300);

        return () => clearTimeout(timer);

    }, [
        search,
        category,
        sortBy,
        direction
    ]);

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this book?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await api.delete(`/books/${id}`);

            setBooks(
                books.filter(
                    book => book.id !== id
                )
            );

        } catch (error) {

            console.error(
                "Delete error:",
                error
            );

            setError(
                "Unable to delete book."
            );
        }
    };

    const clearFilters = () => {

        setSearch("");
        setCategory("");
        setSortBy("id");
        setDirection("asc");
    };

    return (
        <div className="books-container">

            {/* ================= HEADER ================= */}

            <div className="books-header">

                <div>

                    <h2>Bookstore</h2>

                    <p>
                        Discover your next great read
                    </p>

                </div>

                {isAdmin && (
                    <Link
                        to="/books/add"
                        className="primary-button add-book-button"
                    >
                        + Add Book
                    </Link>
                )}

            </div>


            {/* ================= SEARCH & FILTERS ================= */}

            <div className="book-filters">

                <div className="search-box">

                    <span className="search-icon">
                        🔍
                    </span>

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search by title or author..."
                    />

                </div>


                <div className="filter-group">

                    <select
                        value={category}
                        onChange={(event) =>
                            setCategory(event.target.value)
                        }
                    >

                        <option value="">
                            All Categories
                        </option>

                        {categories.map(
                            currentCategory => (
                                <option
                                    key={currentCategory}
                                    value={currentCategory}
                                >
                                    {currentCategory}
                                </option>
                            )
                        )}

                    </select>


                    <select
                        value={`${sortBy}-${direction}`}
                        onChange={(event) => {

                            const [newSortBy, newDirection] =
                                event.target.value.split("-");

                            setSortBy(newSortBy);
                            setDirection(newDirection);

                        }}
                    >

                        <option value="id-asc">
                            Default
                        </option>

                        <option value="title-asc">
                            Title: A → Z
                        </option>

                        <option value="title-desc">
                            Title: Z → A
                        </option>

                        <option value="price-asc">
                            Price: Low → High
                        </option>

                        <option value="price-desc">
                            Price: High → Low
                        </option>

                        <option value="author-asc">
                            Author: A → Z
                        </option>

                        <option value="quantity-desc">
                            Stock: High → Low
                        </option>

                    </select>


                    {(search || category) && (

                        <button
                            onClick={clearFilters}
                            className="clear-filter-button"
                        >
                            Clear
                        </button>

                    )}

                </div>

            </div>


            {/* ================= ERROR ================= */}

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}


            {/* ================= LOADING ================= */}

            {loading ? (

                <div className="books-loading">

                    <p>
                        Loading books...
                    </p>

                </div>

            ) : books.length === 0 ? (

                /* ================= EMPTY ================= */

                <div className="empty-books">

                    <h3>
                        No books found
                    </h3>

                    <p>
                        Try changing your search or filters.
                    </p>

                    {(search || category) && (

                        <button
                            onClick={clearFilters}
                            className="primary-button"
                        >
                            Clear Filters
                        </button>

                    )}

                </div>

            ) : (

                /* ================= BOOK GRID ================= */

                <>

                    <div className="books-result-info">

                        <p>
                            {books.length}{" "}
                            {books.length === 1
                                ? "book"
                                : "books"
                            } found
                        </p>

                    </div>

                    <div className="books-grid">

                        {books.map(book => (

                            <BookCard
                                key={book.id}
                                book={book}
                                onDelete={handleDelete}
                            />

                        ))}

                    </div>

                </>

            )}

        </div>
    );
}

export default Books;