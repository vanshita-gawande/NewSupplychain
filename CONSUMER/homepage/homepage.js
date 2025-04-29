import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ethers } from "ethers";
import contractArtifact from "./Supplychain.json";
import Swal from "sweetalert2";
import "@fortawesome/fontawesome-free/css/all.min.css";
import './ConsumerHomepage.css';
import ReviewModal from "./ReviewModal";
import { QRCodeSVG } from 'qrcode.react';

const contractABI = contractArtifact.abi;
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

const productStatusMapping = ["Created", "Distributed", "Retailed"];
const roleMapping = ["Farmer", "Distributor", "Retailer"];
const username = JSON.parse(sessionStorage.getItem("user"))?.name || "Consumer";

const ConsumerHomepage = ({ setLoginUser }) => {
    const [activeSection, setActiveSection] = useState(
        sessionStorage.getItem("activeTab") || "purchase"
    );
    const [formData, setFormData] = useState({ productId: '' });
    const [insertedDetails, setInsertedDetails] = useState([]);
    const [productJourney, setProductJourney] = useState(null);
    const [journeyStatus, setJourneyStatus] = useState("");
    const [currentRole, setCurrentRole] = useState("");
    const navigate = useNavigate();

    // const [showQR, setShowQR] = useState(false);

    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDetails, setShowDetails] = useState(null);
    const [reviews, setReviews] = useState(() => {
        return JSON.parse(sessionStorage.getItem("productReviews")) || {};
    });

    useEffect(() => {
        const user = sessionStorage.getItem("user");

        if (!user) {
            navigate("/CONSUMER/login", { replace: true });
        } else {
            const storedDetails = sessionStorage.getItem("retailorInsertedDetails");
            if (storedDetails) {
                setInsertedDetails(JSON.parse(storedDetails));
            }
        }
    }, [navigate]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleGetProductJourney = async () => {
        try {
            const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
            const contract = new ethers.Contract(contractAddress, contractABI, provider);
            const journey = await contract.getProductJourney(formData.productId);
            const status = await contract.getProdStatus(formData.productId);
            const role = await contract.getCurrentRole(formData.productId);

            setProductJourney(journey);
            setJourneyStatus(productStatusMapping[Number(status)] || "Unknown Status");
            setCurrentRole(roleMapping[Number(role)] || "Unknown Role");
        } catch (error) {
            console.error("Error fetching product journey:", error);
            Swal.fire({
                title: "Error!",
                text: "Failed to fetch product journey. Check console for details.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    const handleLogout = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, logout!"
        }).then((result) => {
            if (result.isConfirmed) {
                sessionStorage.removeItem("user");
                if (setLoginUser) {
                    setLoginUser(null);
                }

                // Prevent back button access by replacing history
                navigate("/CONSUMER/login", { replace: true });
                Swal.fire("Logged Out!", "You have been successfully logged out.", "success");
            }
        });
    };

    const getInitials = (name) => {
        if (!name) return "C";
        const words = name.split(" ");
        return words.length > 1
            ? words[0][0].toUpperCase() + words[1][0].toUpperCase()
            : words[0][0].toUpperCase();
    };
    const userInitials = getInitials(username);

    useEffect(() => {
        sessionStorage.setItem("activeTab", activeSection);
    }, [activeSection]);

    useEffect(() => {
        document.body.classList.add('conbody');
        return () => {
            document.body.classList.remove('conbody');
        };
    }, []);

    //handl buy now
    const handleBuyNow = (product) => {
        // Show your scanner image in a modal or popup
        const scannerContainer = document.createElement("div");
        scannerContainer.innerHTML = `
        <div id="scanner-overlay" style="position: fixed; top: 0; left: 0; 
            width: 100%; height: 100%; background: rgba(0,0,0,0.6); 
            display: flex; justify-content: center; align-items: center; z-index: 9999;">
            <div style="background: white; padding: 20px; border-radius: 10px; text-align: center;">
                <h3>Scan to Pay</h3>
                <img src="/Scanner _Vanshita.jpg" alt="Scanner"
                    style="max-width: 300px; height: auto; margin: 10px 0;" />
                <button id="close-scanner" style="margin-top: 10px; padding: 8px 12px; border: none; 
                    background-color: #3399cc; color: white; border-radius: 5px; cursor: pointer;">
                    Continue to Razorpay
                </button>
            </div>
        </div>
    `;
        document.body.appendChild(scannerContainer);

        // Add close button handler
        document.getElementById("close-scanner").addEventListener("click", () => {
            document.getElementById("scanner-overlay").remove();

            // Load Razorpay script after scanner is shown
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            document.body.appendChild(script);

            script.onload = () => {
                const options = {
                    key: "rzp_test_YourTestKeyHere",
                    amount: product.price * 100,
                    currency: "INR",
                    name: "Your Company Name",
                    description: `Payment for ${product.name}`,
                    image: "https://yourlogo.com/logo.png",
                    handler: function (response) {
                        Swal.fire({
                            title: "Payment Successful!",
                            text: `Transaction ID: ${response.razorpay_payment_id}`,
                            icon: "success",
                            confirmButtonText: "OK",
                        });
                    },
                    prefill: {
                        name: "Your Name", // replace as needed
                        email: "test@example.com",
                        contact: "9999999999",
                    },
                    theme: {
                        color: "#3399cc",
                    },
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            };
        });
    };


    const handleSubmitReview = (productId, review) => {
        setReviews((prevReviews) => {
            const updatedReviews = {
                ...prevReviews,
                [productId]: [...(prevReviews[productId] || []), review],
            };
            sessionStorage.setItem("productReviews", JSON.stringify(updatedReviews));
            return updatedReviews;
        });

        // Ensure modal closes AFTER state update
        setTimeout(() => {
            setShowReviewModal(false);
        }, 100);
    };


    return (
        <div className="con-app-container">
            <div className="con-sidebar">
                <div className="con-profile-section text-center">
                    <div className="con-profile-img">{userInitials}</div>
                    <h5 className="con-user-name">{username.toUpperCase()}</h5>
                </div>
                <ul className="con-nav flex-column">
                    {[
                        { key: "purchase", label: "Purchase", icon: "fa-shopping-cart" },

                    ].map(({ key, label, icon }) => (
                        <li
                            key={key}
                            className={`con-nav-item ${activeSection === key ? "active" : ""}`}
                            onClick={() => setActiveSection(key)}
                        >
                            <i className={`fa-solid ${icon}`}></i> {label}
                        </li>
                    ))}
                    <li className="con-nav-item logout" onClick={handleLogout}>
                        <i className="fa-solid fa-sign-out-alt"></i> Logout
                    </li>

                </ul>
            </div>
            <div className="con-main-content">
                {activeSection === "purchase" && (
                    <div className="con-details-container">
                        <div className="con-product-cards">
                            {insertedDetails.length > 0 ? (
                                insertedDetails.map((detail, index) => (
                                    <div key={index} className="con-product-card">
                                        {detail.imageUrl && (
                                            <img
                                                src={detail.imageUrl}
                                                alt="Product"
                                                className="con-product-image"
                                                width="100"
                                                height="100"
                                            />


                                        )}

                                        <div className="con-product-details">
                                            <h5><i className="fa-solid fa-barcode"></i> Product ID: {detail.productId}</h5>
                                            <p><i className="fa-solid fa-tag"></i> <strong>Name:</strong> {detail.name}</p>
                                            <p><i className="fa-solid fa-location-dot"></i> <strong>Location:</strong> {detail.location}</p>
                                            <p><i className="fa-solid fa-boxes-stacked"></i> <strong>Quantity:</strong> {detail.quantity}</p>
                                            <p><i className="fa-solid fa-dollar-sign"></i> <strong>Price:</strong> {detail.price}</p>
                                            <p><i className="fa-solid fa-box"></i> <strong>Product Name:</strong> {detail.productName}</p>
                                            <p><i className="fa-solid fa-truck"></i> <strong>Transport Method:</strong> {detail.transportMethod}</p>

                                            {/* Show More Details Toggle Button */}
                                            <button
                                                className={`con-btn-toggle-details ${showDetails === detail ? "active" : ""}`}
                                                onClick={() => setShowDetails(showDetails === detail ? null : detail)}
                                            >
                                                {showDetails === detail ? "Hide Details" : "Show More Details"}
                                                <i className="fa-solid fa-chevron-down"></i>
                                            </button>


                                            {/* Wrap Only These Buttons Inside "Show More Details" */}
                                            {showDetails === detail && (
                                                <div className="con-more-details">
                                                    {/* Fetch Journey Button */}
                                                    {/* QR Code for Product Journey */}
                                                    <div className="qr-code-container">
                                                        <p><i className="fa-solid fa-qrcode"></i> Scan to view Product Journey:</p>
                                                        <QRCodeSVG
                                                            value={`http://192.168.213.80:3000/CONSUMER/product-journey/${detail.productId}`}
                                                            size={128}
                                                            bgColor="#ffffff"
                                                            fgColor="#000000"
                                                            level="H"
                                                            includeMargin={true}
                                                        />
                                                        {/* Optional fallback link */}
                                                        <div style={{ marginTop: "8px" }}>
                                                            <Link to={`/CONSUMER/product-journey/${detail.productId}`} className="con-btn-primary">
                                                                <i className="fa-solid fa-eye"></i> View Journey
                                                            </Link>
                                                        </div>
                                                    </div>


                                                    {/* Buy Now Button */}
                                                    <button
                                                        className="con-btn-secondary"
                                                        onClick={() => handleBuyNow(detail)}
                                                    >
                                                        <i className="fa-solid fa-credit-card"></i> Buy Now
                                                    </button>

                                                    {/* Write Review Button */}
                                                    <button
                                                        className="con-btn-review"
                                                        onClick={() => {
                                                            setSelectedProduct(detail);
                                                            setShowReviewModal(true);
                                                        }}
                                                    >
                                                        <i className="fa-solid fa-star"></i> Write a Review
                                                    </button>

                                                    {/* Show Reviews Button */}
                                                    <button
                                                        className="con-btn-review"
                                                        onClick={() => setSelectedProduct(selectedProduct === detail ? null : detail)}
                                                    >
                                                        <i className="fa-solid fa-eye"></i> {selectedProduct === detail ? "Hide Reviews" : "Show Reviews"}
                                                    </button>

                                                    {/* Display Reviews Conditionally */}
                                                    {selectedProduct === detail && (
                                                        <>
                                                            <h5>Reviews:</h5>
                                                            {reviews[detail.productId]?.length > 0 ? (
                                                                <ul>
                                                                    {reviews[detail.productId].map((review, index) => (
                                                                        <li key={index}>
                                                                            {Array(review.rating).fill("⭐").join("")} - {review.text}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            ) : (
                                                                <p>No reviews yet.</p>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            )}


                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No products available for purchase.</p>
                            )}
                        </div>


                    </div>
                )}

                {activeSection === "getProductJourney" && (
                    <div className="con-journey-container">
                        <div className="journey-box">
                            <h4>Product Journey</h4>

                            <div className="con-form-group">
                                <label>Enter Product ID:</label>
                                <input
                                    className='con-input'
                                    type="text"
                                    name="productId"
                                    placeholder="Enter Product ID"
                                    value={formData.productId}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <button className="con-btn-primary" onClick={handleGetProductJourney} disabled={!formData.productId.trim()}>
                                <i className="fa-solid fa-route"></i> Get Product Journey
                            </button>

                            {productJourney ? (
                                <div className="con-journey-timeline">
                                    <h4>Your Product Journey</h4>
                                    <ul className="timeline">
                                        <li>
                                            <div className="timeline-content">
                                                <i className="fa-solid fa-map-signs"></i>
                                                <strong>Journey:</strong>  <span style={{
                                                    fontSize: "16px",
                                                    fontWeight: "600",
                                                    color: "#fff",
                                                    background: "#b98d1f",
                                                    padding: "5px 10px",
                                                    borderRadius: "6px",
                                                    fontFamily: "monospace",
                                                    display: "inline-block",
                                                    marginLeft: "8px",
                                                    boxShadow: "2px 4px 8px rgba(0, 0, 0, 0.2)",
                                                    transition: "all 0.3s ease-in-out"
                                                }}>
                                                    {productJourney.toString()}
                                                </span>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="timeline-content">
                                                <i className="fa-solid fa-clipboard-list"></i>
                                                <strong>Status:</strong> {journeyStatus}
                                            </div>
                                        </li>
                                        <li>
                                            <div className="timeline-content">
                                                <i className="fa-solid fa-user-tag"></i>
                                                <strong>Current Role:</strong> {currentRole}
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                            ) : (
                                <p className="con-no-journey">No journey details available.</p>
                            )}
                        </div>
                    </div>
                )}

            </div>

            {showReviewModal && selectedProduct && (
                <ReviewModal
                    product={selectedProduct}
                    onClose={() => setShowReviewModal(false)}
                    onSubmitReview={handleSubmitReview}
                />
            )}


        </div>
    );
}

export default ConsumerHomepage;
