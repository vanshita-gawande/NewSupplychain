import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import contractArtifact from "./Supplychain.json";
import Swal from "sweetalert2";

const contractABI = contractArtifact.abi;
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

const productStatusMapping = ["Created", "Distributed", "Wholeselled", "Retailed"];
const roleMapping = ["Farmer", "Distributor", "Wholesaler", "Retailer"];

const Journey = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [productId, setProductId] = useState(location.state?.productId || sessionStorage.getItem("productId") || "");
  const [productJourney, setProductJourney] = useState(null);
  const [journeyStatus, setJourneyStatus] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchJourney = useCallback(async () => {
    if (!productId.trim()) {
      Swal.fire({
        title: "Error!",
        text: "Please enter a valid Product ID",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    console.log("🔄 Fetching journey for productId:", productId);
    setLoading(true);

    try {
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
      console.log("✅ Connected to Blockchain Provider");
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      console.log("✅ Smart Contract Loaded:", contractAddress);

      const journey = await contract.getProductJourney(productId);
      console.log("📌 Journey Data:", journey);
      const status = await contract.getProdStatus(productId);
      console.log("📌 Status Data:", status);
      const role = await contract.getCurrentRole(productId);
      console.log("📌 Role Data:", role);

      setProductJourney(journey.length > 0 ? journey : null);
      setJourneyStatus(productStatusMapping[Number(status)] || "Unknown Status");
      setCurrentRole(roleMapping[Number(role)] || "Unknown Role");
    } catch (error) {
      console.error("❌ Error fetching product journey:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch product journey. Check console for details.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    console.log("📌 useEffect Triggered with Product ID:", productId);
    if (productId) {
      fetchJourney();
    }
  }, [productId, fetchJourney]);

  return (
    <div className="journey-container">
      <div className="farm-journey-container">
        <div className="journey-box">
          <h4>Product Journey</h4>

          <div className="farm-enter-prod-ID">
            <input
              className='farm-input'
              type="text"
              name="productId"
              placeholder="Enter Product ID"
              value={productId}
              onChange={(e) => {
                setProductId(e.target.value);
                sessionStorage.setItem("productId", e.target.value);
              }}
              required
            />
          </div>

          <button className="farm-btn-primary" onClick={fetchJourney} disabled={!productId.trim() || loading}>
            <i className="fa-solid fa-route"></i> {loading ? "Fetching..." : "Fetch Journey"}
          </button>

          {loading ? (
            <p>Loading journey details...</p>
          ) : productJourney ? (
            <div className="farm-journey-timeline">
              <h4>Your Product Journey</h4>
              <ul className="farm-timeline">
                <li>
                  <div className="farm-timeline-content">
                    <i className="fa-solid fa-map-signs"></i>
                    <strong>Journey:</strong>  
                    <span className="journey-details">{productJourney.join(" → ")}</span>
                  </div>
                </li>
                <li>
                  <div className="farm-timeline-content">
                    <i className="fa-solid fa-clipboard-list"></i>
                    <strong>Status:</strong> {journeyStatus}
                  </div>
                </li>
                <li>
                  <div className="farm-timeline-content">
                    <i className="fa-solid fa-user-tag"></i>
                    <strong>Current Role:</strong> {currentRole}
                  </div>
                </li>
              </ul>
            </div>
          ) : (
            <p className="farm-no-journey">No journey details available.</p>
          )}
        </div>
      </div>
      <button onClick={() => navigate(-1)}>🔙 Back</button>
    </div>
  );
};

export default Journey;
