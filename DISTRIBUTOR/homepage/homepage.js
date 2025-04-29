import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ethers } from "ethers";
import contractArtifact from "./Supplychain.json";
import "@fortawesome/fontawesome-free/css/all.min.css";
import './DistHomepage.css';
import Swal from "sweetalert2";

const contractABI = contractArtifact.abi;
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const privateKey = process.env.PRIVATE_KEY;

const productStatusMapping = ["Created", "Distributed", "Retailed"];
const roleMapping = ["Farmer", "Distributor", "Retailer"];
const username = JSON.parse(sessionStorage.getItem("user"))?.name || "Distributor";

const DistributorHomepage = ({ setLoginUser }) => {

    const [activeSection, setActiveSection] = useState(
        sessionStorage.getItem("activeTab") || "insertDetails"
    );

    const [formData, setFormData] = useState({
        productId: '',
        name: '',
        location: '',
        quantity: '',
        price: '',
        productName: '',
        transportMethod: '',
    });

    const [insertedDetails, setInsertedDetails] = useState([]);
    const [productJourney, setProductJourney] = useState(null);
    const [journeyStatus, setJourneyStatus] = useState("");
    const [currentRole, setCurrentRole] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const storedDetails = sessionStorage.getItem("distributorInsertedDetails");
        if (storedDetails) setInsertedDetails(JSON.parse(storedDetails));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // for image
    const handleImageChange = (e) => {
        if (e.target.files.length > 0) {
            // Do nothing with the file (avoid storing it)
            console.log("Image selected:", e.target.files[0].name);
        }
    };



    const handleAddProductDetails = async () => {
        try {
            const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
            const wallet = new ethers.Wallet(privateKey, provider);
            const contract = new ethers.Contract(contractAddress, contractABI, wallet);


            const transaction = await contract.DistributorInsertDetails(
                formData.productId,
                formData.name,
                formData.location,
                BigInt(formData.quantity),
                BigInt(formData.price),
                formData.productName,
                formData.transportMethod,

            );

            await transaction.wait();
            const formDataToSend = new FormData();
            formDataToSend.append("productData", JSON.stringify(formData)); // Send as JSON string
            const imageInput = document.getElementById("imageInput");
            if (imageInput && imageInput.files.length > 0) {
                formDataToSend.append("image", imageInput.files[0]); // Attach image
            } else {
                console.warn("No image selected!");
            }

            for (let [key, value] of formDataToSend.entries()) {
                console.log("FormData Key:", key, "Value:", value);
            }


            const response = await fetch("http://localhost:9002/api/distproducts", {
                method: "POST",
                body: formDataToSend, // No need for headers with FormData
            });

            if (!response.ok) {
                throw new Error("Failed to save in MongoDB");
            }

            const savedProduct = await response.json();
            if (!savedProduct || !savedProduct.imageUrl) {
                throw new Error("Invalid response from backend");
            }
            const updatedProduct = {
                ...savedProduct,
                imageUrl: `http://localhost:9002/uploads/${savedProduct.imageUrl.split('/').pop()}`,
            };


            console.log("Final Product:", updatedProduct);
            savedProduct.imageUrl = `http://localhost:9002/uploads/${savedProduct.imageUrl.split('/').pop()}`;

            // const updatedDetails = [...insertedDetails, savedProduct];
            // setInsertedDetails(updatedDetails);
            // sessionStorage.setItem("insertedDetails", JSON.stringify(updatedDetails));

            const updatedDetails = [...(JSON.parse(sessionStorage.getItem("distributorInsertedDetails")) || []), savedProduct];
            setInsertedDetails(updatedDetails);
            sessionStorage.setItem("distributorInsertedDetails", JSON.stringify(updatedDetails));


            // popup

            // ✅ Show success popup instead of alert
            Swal.fire({
                title: "Success!",
                text: "Product details added successfully to Blockchain & MongoDB!",
                icon: "success",
                confirmButtonText: "OK",
            }).then(() => {
                setActiveSection("viewInsertedDetails"); // ✅ Navigate after closing popup
            });

        } catch (error) {
            console.error("Transaction failed:", error);

            // Default error message
            let errorMessage = "Transaction failed. Check console for details.";

            // Check if it's a known blockchain revert error
            if (error.message.includes("Product ID already exists for Distributor role")) {
                errorMessage = "Product ID already exists for this Distributor!";
            }

            // Show popup with appropriate message
            Swal.fire({
                title: "Error!",
                text: errorMessage,
                icon: "error",
                confirmButtonText: "OK",
            });
        }
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
            alert("Failed to fetch product journey. Please check the console.");
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

                // ⛔ Prevent back button access by replacing history
                navigate("/DISTRIBUTOR/login", { replace: true });
                Swal.fire("Logged Out!", "You have been successfully logged out.", "success");
            }
        });
    };

    const getInitials = (name) => {
        if (!name) return "D";
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
        document.body.classList.add('distbody');
        return () => {
            document.body.classList.remove('distbody');
        };
    }, []);


    return (
        <div className="dist-homepage">
            <div className="dist-sidebar">
                <div className="dist-profile-section text-center">
                    <div className="dist-profile-img">{userInitials}</div>
                    <h5 className="dist-user-name">{username.toUpperCase()}</h5>
                </div>
                <ul className="dist-nav flex-column">
                    {[
                        { key: "insertDetails", label: "Insert Details", icon: "fa-solid fa-plus-circle" },
                        { key: "viewInsertedDetails", label: "View Products", icon: "fa-solid fa-eye" },
                        { key: "getProductJourney", label: "Get Product Journey", icon: "fa-solid fa-route" }
                    ].map(({ key, label, icon }) => (
                        <li
                            key={key}
                            className={`dist-nav-item ${activeSection === key ? "active" : ""}`}
                            onClick={() => setActiveSection(key)}
                        >
                            <i className={icon}></i> {label}
                        </li>
                    ))}
                    <li className="dist-nav-item-logout" onClick={handleLogout}>
                        <i className="fa-solid fa-sign-out-alt"></i> Logout
                    </li>
                </ul>

            </div>
            <div className="dist-main-content">
                {activeSection === "insertDetails" && (
                    <div className="dist-form-container">
                        {/* Left Side - Form */}
                        <div className="dist-form-section">
                            <h4>Enter Product Details</h4>
                            <form onSubmit={(e) => { e.preventDefault(); handleAddProductDetails(); }}>
                                <div className="dist-form-grid">
                                    {Object.keys(formData).map((key) =>
                                        key !== "imageUrl" ? (
                                            <div key={key} className="dist-form-group">
                                                <input
                                                    type={key.includes("Date") ? "date" : "text"}
                                                    placeholder={key}
                                                    name={key}
                                                    value={formData[key]}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        ) : null
                                    )}
                                    <div className="dist-form-group image-upload">
                                        <label>Upload Product Image:</label>
                                        <input id="imageInput" type="file" accept="image/*" onChange={handleImageChange} />
                                    </div>
                                </div>

                                <button className="dist-form-group-submit" id="submit" type="submit">Insert Details</button>

                            </form>
                        </div>

                        {/* Right Side - Image Preview */}

                    </div>


                )}
                {activeSection === "viewInsertedDetails" && (
                    <div className="dist-details-container">
                        <div className="dist-product-cards">
                            {insertedDetails.length > 0 ? (
                                insertedDetails.map((detail, index) => (
                                    <div key={index} className="dist-product-card">
                                        {detail.imageUrl && (
                                            <img
                                                src={detail.imageUrl}
                                                alt="Product"
                                                className="dist-product-image" width="100" height="100"
                                            />
                                        )}
                                        <div className="dist-product-details">
                                            <h5><i className="fa-solid fa-barcode"></i> Product ID: {detail.productId}</h5>
                                            <p><i className="fa-solid fa-tag"></i> <strong>Name:</strong> {detail.name}</p>
                                            <p><i className="fa-solid fa-location-dot"></i> <strong>Location:</strong> {detail.location}</p>
                                            <p><i className="fa-solid fa-boxes-stacked"></i> <strong>Quantity:</strong> {detail.quantity}</p>
                                            <p><i className="fa-solid fa-dollar-sign"></i> <strong>Price:</strong> {detail.price}</p>
                                            <p><i className="fa-solid fa-box"></i> <strong>Product Name:</strong> {detail.productName}</p>
                                            <p><i className="fa-solid fa-truck"></i> <strong>Transport Method:</strong> {detail.transportMethod}</p>

                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className='Nodetails'>No product details inserted yet.</p>
                            )}
                        </div>
                    </div>
                )}
                {activeSection === "getProductJourney" && (
                    <div className="dist-journey-container">
                        <div className="journey-box">
                            <h4>Product Journey</h4>

                            <div className="dist-enter-prod-ID">
                                <label>Enter Product ID:</label>
                                <input
                                    className='dist-input'
                                    type="text"
                                    name="productId"
                                    placeholder="Enter Product ID"
                                    value={formData.productId}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <button className="dist-btn-primary" onClick={handleGetProductJourney} disabled={!formData.productId.trim()}>
                                <i className="fa-solid fa-route"></i> Fetch Journey
                            </button>

                            {productJourney ? (
                                <div className="dist-journey-timeline">
                                    <h4>Your Product Journey</h4>
                                    <ul className="dist-timeline">
                                        <li>
                                            <div className="dist-timeline-content">
                                                <i className="fa-solid fa-map-signs"></i>
                                                <strong>Journey:</strong>  <span style={{
                                                    fontSize: "16px",
                                                    fontWeight: "600",
                                                    color: "#000",
                                                    background: "#f5f5f5",
                                                    padding: "5px 10px",
                                                    borderRadius: "6px",
                                                    fontFamily: "monospace",
                                                    display: "inline-block",
                                                    marginLeft: "8px",
                                                    boxShadow: " rgb(0 0 0 / 0%) 2px 4px 8px",
                                                    transition: "all 0.3s ease-in-out"
                                                }}>
                                                    {productJourney.toString()}
                                                </span>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="dist-timeline-content">
                                                <i className="fa-solid fa-clipboard-list"></i>
                                                <strong>Status:</strong> {journeyStatus}
                                            </div>
                                        </li>
                                        <li>
                                            <div className="dist-timeline-content">
                                                <i className="fa-solid fa-user-tag"></i>
                                                <strong>Current Role:</strong> {currentRole}
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                            ) : (
                                <p className="dist-no-journey">No journey details available.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DistributorHomepage;
