import React, { useState } from "react";
import './ReviewModal.css';

const ReviewModal = ({ product, onClose, onSubmitReview }) => {
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = () => {
        if (!reviewText.trim()) {
            setError("Review cannot be empty!");
            return;
        }

        if (!product?.productId) {
            setError("Invalid product data.");
            return;
        }

        onSubmitReview?.(product.productId, { rating, text: reviewText });
        onClose();
    };

    return product ? ( // Prevent rendering if product is undefined
        <div className="review-modal">
            <div className="review-content">
                <h2>Review {product.name}</h2>

                <label>Rating:</label>
                <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((num) => (
                        <i
                            key={num}
                            className={`fa-star ${num <= rating ? "fa-solid" : "fa-regular"}`}
                            onClick={() => setRating(num)}
                            style={{ cursor: "pointer", color: num <= rating ? "#FFD700" : "#ccc", fontSize: "24px" }}
                        ></i>
                    ))}
                </div>


                <label>Review:</label>
                <textarea value={reviewText} onChange={(e) => {
                    setReviewText(e.target.value);
                    setError(""); // Clear error when typing
                }} />

                {error && <p className="error-text">{error}</p>} {/* Show error message */}

                <div className="review-buttons">
                    <button onClick={handleSubmit} className="submit-btn">Submit</button>
                    <button onClick={onClose} className="close-btn">Close</button>
                </div>
            </div>
        </div>
    ) : null; // Return nothing if product is undefined
};

export default ReviewModal;
