import { Link } from "react-router-dom";

function BookCard({ book, onDelete }) {

    return (
        <div className="book-card">

            {book.imageUrl && (
                <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="book-image"
                />
            )}

            <div className="book-card-content">

                <h3>{book.title}</h3>

                <p className="book-author">
                    by {book.author}
                </p>

                <p className="book-category">
                    {book.category}
                </p>

                <p className="book-description">
                    {book.description}
                </p>

                <p className="book-price">
                    ₹{book.price}
                </p>

                <p>
                    Stock: {book.quantity}
                </p>

                <div className="book-actions">

                    <Link
                        to={`/books/edit/${book.id}`}
                        className="edit-button"
                    >
                        Edit
                    </Link>

                    <button
                        onClick={() => onDelete(book.id)}
                        className="delete-button"
                    >
                        Delete
                    </button>

                </div>

            </div>

        </div>
    );
}

export default BookCard;