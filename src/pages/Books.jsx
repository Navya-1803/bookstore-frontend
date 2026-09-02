import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import BookCard from "../components/BookCard";
import { useAuth } from "../context/AuthContext";

function Books() {

    const { user } = useAuth();

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Search
    const [searchTerm, setSearchTerm] = useState("");

    // Filter
    const [categoryFilter, setCategoryFilter] = useState("ALL");

    // Sort
    const [sortOption, setSortOption] = useState("DEFAULT");

    const isAdmin = user?.role === "ADMIN";

    /*
     * ---------------------------------------------------------
     * FETCH BOOKS
     * ---------------------------------------------------------
     */

    const fetchBooks = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("/books");

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
        fetchBooks();
    }, []);


    /*
     * ---------------------------------------------------------
     * DELETE BOOK
     * ---------------------------------------------------------
     */

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

            setBooks((previousBooks) =>
                previousBooks.filter(
                    (book) => book.id !== id
                )
            );

        } catch (error) {

            console.error(
                "Delete error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to delete book."
            );
        }
    };


    /*
     * ---------------------------------------------------------
     * GET UNIQUE CATEGORIES
     * ---------------------------------------------------------
     */

    const categories = useMemo(() => {

        const categorySet = new Set();

        books.forEach((book) => {

            if (book.category) {
                categorySet.add(book.category);
            }

        });

        return Array.from(categorySet).sort();

    }, [books]);


    /*
     * ---------------------------------------------------------
     * SEARCH + FILTER + SORT
     * ---------------------------------------------------------
     */

    const filteredAndSortedBooks = useMemo(() => {

        let result = [...books];

        /*
         * SEARCH
         *
         * Searches by:
         * - title
         * - author
         * - category
         */

        const search = searchTerm
            .trim()
            .toLowerCase();

        if (search) {

            result = result.filter((book) => {

                const title =
                    book.title?.toLowerCase() || "";

                const author =
                    book.author?.toLowerCase() || "";

                const category =
                    book.category?.toLowerCase() || "";

                return (
                    title.includes(search) ||
                    author.includes(search) ||
                    category.includes(search)
                );

            });
        }


        /*
         * CATEGORY FILTER
         */

        if (categoryFilter !== "ALL") {

            result = result.filter(
                (book) =>
                    book.category === categoryFilter
            );
        }


        /*
         * SORT
         */

        switch (sortOption) {

            case "TITLE_ASC":

                result.sort((a, b) =>
                    (a.title || "").localeCompare(
                        b.title || ""
                    )
                );

                break;


            case "TITLE_DESC":

                result.sort((a, b) =>
                    (b.title || "").localeCompare(
                        a.title || ""
                    )
                );

                break;


            case "PRICE_LOW":

                result.sort(
                    (a, b) =>
                        Number(a.price) -
                        Number(b.price)
                );

                break;


            case "PRICE_HIGH":

                result.sort(
                    (a, b) =>
                        Number(b.price) -
                        Number(a.price)
                );

                break;


            case "STOCK_HIGH":

                result.sort(
                    (a, b) =>
                        Number(b.quantity) -
                        Number(a.quantity)
                );

                break;


            default:
                break;
        }

        return result;

    }, [
        books,
        searchTerm,
        categoryFilter,
        sortOption
    ]);


    /*
     * ---------------------------------------------------------
     * CLEAR SEARCH / FILTERS
     * ---------------------------------------------------------
     */

    const clearFilters = () => {

        setSearchTerm("");
        setCategoryFilter("ALL");
        setSortOption("DEFAULT");

    };


    /*
     * ---------------------------------------------------------
     * LOADING
     * ---------------------------------------------------------
     */

    if (loading) {

        return (
            <div className="page-message">
                <p>Loading books...</p>
            </div>
        );
    }


    /*
     * ---------------------------------------------------------
     * PAGE
     * ---------------------------------------------------------
     */

    return (

        <div className="books-container">

            {/* HEADER */}

            <div className="books-header">

                <div>

                    <h2>Bookstore</h2>

                    <p>
                        Browse our collection of books
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


            {/* ERROR */}

            {error && (

                <p className="error-message">
                    {error}
                </p>

            )}


            {/* SEARCH / FILTER / SORT */}

            {books.length > 0 && (

                <div className="book-controls">

                    {/* SEARCH */}

                    <div className="book-search">

                        <label htmlFor="book-search">
                            Search Books
                        </label>

                        <div className="search-input-wrapper">

                            <span className="search-icon">
                                🔍
                            </span>

                            <input
                                id="book-search"
                                type="text"
                                placeholder="Search by title, author or category..."
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                    </div>


                    {/* CATEGORY */}

                    <div className="book-filter">

                        <label htmlFor="category-filter">
                            Category
                        </label>

                        <select
                            id="category-filter"
                            value={categoryFilter}
                            onChange={(event) =>
                                setCategoryFilter(
                                    event.target.value
                                )
                            }
                        >

                            <option value="ALL">
                                All Categories
                            </option>

                            {categories.map(
                                (category) => (

                                    <option
                                        key={category}
                                        value={category}
                                    >
                                        {category}
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* SORT */}

                    <div className="book-sort">

                        <label htmlFor="sort-books">
                            Sort By
                        </label>

                        <select
                            id="sort-books"
                            value={sortOption}
                            onChange={(event) =>
                                setSortOption(
                                    event.target.value
                                )
                            }
                        >

                            <option value="DEFAULT">
                                Default
                            </option>

                            <option value="TITLE_ASC">
                                Title: A → Z
                            </option>

                            <option value="TITLE_DESC">
                                Title: Z → A
                            </option>

                            <option value="PRICE_LOW">
                                Price: Low → High
                            </option>

                            <option value="PRICE_HIGH">
                                Price: High → Low
                            </option>

                            <option value="STOCK_HIGH">
                                Availability: High → Low
                            </option>

                        </select>

                    </div>


                    {/* CLEAR */}

                    {(searchTerm ||
                        categoryFilter !== "ALL" ||
                        sortOption !== "DEFAULT") && (

                        <button
                            type="button"
                            className="clear-filters-button"
                            onClick={clearFilters}
                        >
                            Clear
                        </button>

                    )}

                </div>

            )}


            {/* RESULT COUNT */}

            {books.length > 0 && (

                <div className="books-result-info">

                    <span>
                        Showing{" "}
                        <strong>
                            {filteredAndSortedBooks.length}
                        </strong>{" "}
                        of{" "}
                        <strong>
                            {books.length}
                        </strong>{" "}
                        books
                    </span>

                </div>

            )}


            {/* BOOKS */}

            {books.length === 0 ? (

                <div className="empty-books">

                    <h3>No books available</h3>

                    <p>
                        {isAdmin
                            ? "Add your first book to get started."
                            : "There are no books available right now."
                        }
                    </p>

                </div>

            ) : filteredAndSortedBooks.length === 0 ? (

                <div className="empty-books">

                    <div className="empty-books-icon">
                        🔍
                    </div>

                    <h3>
                        No books found
                    </h3>

                    <p>
                        Try changing your search or filters.
                    </p>

                    <button
                        type="button"
                        className="clear-filters-button large"
                        onClick={clearFilters}
                    >
                        Clear Search & Filters
                    </button>

                </div>

            ) : (

                <div className="books-grid">

                    {filteredAndSortedBooks.map(
                        (book) => (

                            <BookCard
                                key={book.id}
                                book={book}
                                onDelete={handleDelete}
                            />

                        )
                    )}

                </div>

            )}

        </div>
    );
}

export default Books;