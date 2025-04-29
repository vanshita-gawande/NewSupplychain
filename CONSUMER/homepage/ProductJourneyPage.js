import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import contractArtifact from "./Supplychain.json";


const contractABI = contractArtifact.abi;
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

const productStatusMapping = {
    0: "Created",
    1: "Distributed",
    2: "Retailed",
    3: "Available"

};

const roleMapping = {
    0: "Farmer",
    1: "Distributor",
    2: "Retailer",
    3: "Retailer Store",
};

const ProductJourneyPage = () => {
    const { productId } = useParams();
    const [productJourney, setProductJourney] = useState(null);
    const [journeyStatus, setJourneyStatus] = useState("");
    const [currentRole, setCurrentRole] = useState("");

    useEffect(() => {
        const fetchProductJourney = async () => {
            try {
                if (!contractAddress) {
                    console.error("Contract address is missing. Check .env file.");
                    alert("Contract address not found. Please check your environment configuration.");
                    return;
                }

                console.log("Fetching product journey for Product ID:", productId);

                const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
                const contract = new ethers.Contract(contractAddress, contractABI, provider);

                const journey = await contract.getProductJourney(productId);
                console.log("Product Journey (raw):", journey); // <-- put it here
                const status = await contract.getProdStatus(productId);
                const role = await contract.getCurrentRole(productId);

                console.log("Product Journey:", journey);
                console.log("Product Status:", status);
                console.log("Current Role:", role);

                setProductJourney(journey.split("|"));
                setJourneyStatus(productStatusMapping[Number(status)] || "Unknown Status");
                setCurrentRole(roleMapping[Number(role)] || "Unknown Role");
            } catch (error) {
                console.error("Error fetching product journey:", error);
                alert("Failed to fetch product journey.");
            }
        };

        if (productId) fetchProductJourney();
    }, [productId]);

    return (
        <div className="journey-container">
            <h2 className="journey-title">PRODUCT JOURNEY</h2>
            {productJourney ? (
                <div className="timeline">
                    <div className="timeline-line" />
                    {productJourney.map((step, index) => (
                        <div key={index} className="timeline-item">
                            <div className="timeline-dot">
                                <span className="timeline-icon">
                                    {index === 0 ? '🌾' : index === 1 ? '🚚' : index === 2 ? '🏪' : '🛒'}
                                </span>
                            </div>
                            <div className="timeline-content">
                                <h4 className="step-heading">Step {index + 1}</h4>
                                <p className="step-details">{step.trim()}</p>
                            </div>
                        </div>
                    ))}
                    <div className="current-status-container">
                        <div className="status-card">
                            <div className="status-icon">
                                {journeyStatus === "Created" && "🌾"}   {/* Changed here */}
                                {journeyStatus === "Distributed" && "🚚"}
                                {journeyStatus === "Retailed" && "🏪"}
                                {journeyStatus === "Available" && "🛒"}
                                {!["Created", "Distributed", "Retailed", "Available"].includes(journeyStatus) && "📦"}
                            </div>
                            <div className="status-text-content">
                                <h4>Status</h4>
                                <p>{journeyStatus}</p>
                            </div>
                        </div>

                        <div className="role-card">
                            <div className="role-icon">
                                {currentRole === "Farmer" && "🌾"}
                                {currentRole === "Distributor" && "🚚"}
                                {currentRole === "Retailer" && "🛍️"}
                                {currentRole === "Retailer Store" && "🛍️"}
                                {!["Farmer", "Distributor", "Retailer", "Retailer Store"].includes(currentRole) && "🛠️"}
                            </div>
                            <div className="role-text-content">
                                <h4>Current Role</h4>
                                <p>{currentRole}</p>
                            </div>
                        </div>
                    </div>


                </div>
            ) : (
                <p>No journey details available.</p>
            )}


        </div>
    );

};

export default ProductJourneyPage;
