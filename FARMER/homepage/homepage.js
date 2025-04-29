import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ethers } from "ethers";
import contractArtifact from "./Supplychain.json";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Farmerhomepage.css";
import Swal from "sweetalert2";
import { useMemo } from "react";

const contractABI = contractArtifact.abi;
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const privateKey = process.env.PRIVATE_KEY;

const productStatusMapping = ["Created", "Distributed", "Retailed"];
const roleMapping = ["Farmer", "Distributor", "Retailer"];
// const username = JSON.parse(sessionStorage.getItem("user"))?.name || "Farmer";

function Homepage({ setLoginUser }) {
  // store selection
  const [activeSection, setActiveSection] = useState(
    sessionStorage.getItem("activeTab") || "insertDetails"
  );

  // for username new changes
  const [username, setUsername] = useState(""); // ⬅️ Add this

  const [formData, setFormData] = useState({
    productId: "",
    name: "",
    location: "",
    quantity: "",
    price: "",
    productName: "",
    batchNo: "",
    mfgDate: "",
    expiryDate: "",
    imageUrl: ""
  });
  const [insertedDetails, setInsertedDetails] = useState([]);
  const [productJourney, setProductJourney] = useState(null);
  const [journeyStatus, setJourneyStatus] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const navigate = useNavigate();
  // 
  useEffect(() => {
    if (window.ethereum) {
      // Check if MetaMask is installed
      console.log("MetaMask is installed!");
    } else {
      Swal.fire({
        title: "MetaMask Not Found",
        text: "Please install MetaMask to use this app.",
        icon: "error",
      });
    }
  }, []);
  // useeffect change for username refresh
  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (!user) {
      navigate("/FARMER/login", { replace: true });
    } else {
      const userObj = JSON.parse(user); // Convert back to object
      if (userObj && userObj.name) {
        setUsername(userObj.name); // ⬅️ Set the username
      }
      const storedDetails = sessionStorage.getItem("farmerInsertedDetails");
      if (storedDetails) {
        setInsertedDetails(JSON.parse(storedDetails));
      }
    }
  }, [navigate]);
  // 
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

  const validateBlockchainConfig = () => {
    if (!privateKey) {
      console.error("Private key is missing!");
      return false; // ✅ Return from function instead
    }
    if (!contractAddress || !contractABI) {
      console.error("Contract address or ABI is missing!");
      return false;
    }
    return true; // ✅ Everything is fine
  };
  // metamask


// Empty dependency array ensures this runs once when the component mounts

// //////
  const handleAddProductDetails = async () => {

    if (!validateBlockchainConfig()) return;

    try {
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
      const wallet = new ethers.Wallet(privateKey, provider);
      const contract = new ethers.Contract(contractAddress, contractABI, wallet);
      console.log("Sending data to blockchain:", {
        productId: formData.productId,
        name: formData.name,
        location: formData.location,
        quantity: BigInt(formData.quantity),
        price: BigInt(formData.price),
        productName: formData.productName,
        batchNo: BigInt(formData.batchNo),
        mfgDate: formData.mfgDate,
        expiryDate: formData.expiryDate,
      });

      const transaction = await contract.FarmerInsertDetails(
        formData.productId,
        formData.name,
        formData.location,
        BigInt(formData.quantity),
        BigInt(formData.price),
        formData.productName,
        BigInt(formData.batchNo),
        formData.mfgDate,
        formData.expiryDate
      );
        // Wait for transaction to be mined
        await transaction.wait();

      console.log("Transaction sent, waiting for confirmation...");
      console.log("Transaction Hash:", transaction.hash); // Log transaction hash
      console.log("Transaction sent, waiting for confirmation...");
      await transaction.wait();
      console.log("Transaction confirmed!");
      console.log("Contract Functions:", Object.keys(contract)); // Debugging

      const storedProduct = await contract.getProductJourney(formData.productId);
      console.log("Stored on Blockchain:", storedProduct);

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

      const response = await fetch("http://localhost:9002/api/farmerproducts", {
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
      const updatedDetails = [...(JSON.parse(sessionStorage.getItem("farmerInsertedDetails")) || []), savedProduct];
      setInsertedDetails(updatedDetails);
      sessionStorage.setItem("farmerInsertedDetails", JSON.stringify(updatedDetails));


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
      if (error.message.includes("Product ID already exists for Farmer role")) {
        errorMessage = "Product ID already exists for this Farmer!";
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
  // 
  const handleGetProductJourney = async () => {
    try {
      const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");

      // Debugging: Check contract address and ABI before calling the contract
      console.log("Contract Address:", contractAddress);
      console.log("ABI:", contractABI);

      if (!formData.productId) {
        alert("Please enter a valid Product ID.");
        return;
      }

      console.log("Fetching journey for Product ID:", formData.productId);

      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const journey = await contract.getProductJourney(formData.productId);
      console.log("Product Journey:", journey);
      const status = await contract.getProdStatus(formData.productId);
      console.log("Product Status:", status);
      const role = await contract.getCurrentRole(formData.productId);
      console.log("Current Role:", role);

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
        navigate("/FARMER/login", { replace: true });
        Swal.fire("Logged Out!", "You have been successfully logged out.", "success");
      }
    });
  };

  // const getInitials = (name) => {
  //   if (!name) return "F"; // Default to "F" for Farmer
  //   const words = name.split(" ");
  //   return words.length > 1
  //     ? words[0][0].toUpperCase() + words[1][0].toUpperCase()
  //     : words[0][0].toUpperCase();
  // };
  // const userInitials = getInitials(username);
  // useEffect(() => {
  //   sessionStorage.setItem("activeTab", activeSection);
  // }, [activeSection]);

  // useEffect(() => {
  //   document.body.classList.add('farmbody');
  //   return () => {
  //     document.body.classList.remove('farmbody');
  //   };
  // }, []);
  // used here usememo
  const userInitials = useMemo(() => {
    if (!username) return "F";
    const words = username.split(" ");
    return words.length > 1
      ? words[0][0].toUpperCase() + words[1][0].toUpperCase()
      : words[0][0].toUpperCase();
  }, [username]);
  
  useEffect(() => {
    document.body.classList.add('farmbody');
    return () => {
      document.body.classList.remove('farmbody');
    };
  }, []);

  useEffect(() => {
    sessionStorage.setItem("activeTab", activeSection);
  }, [activeSection]);
  
  return (
    <div className="farm-homepage">
      <div className="farm-sidebar">
      <div className="farm-profile-section text-center">
          <div className="farm-profile-img">{userInitials}</div>
          <h5 className="farm-user-name">{username.toUpperCase()}</h5>
        </div> 
        <ul className="farm-nav flex-column">
          {[
            { key: "insertDetails", label: "Insert Details", icon: "fa-solid fa-plus-circle" },
            { key: "viewInsertedDetails", label: "View Products", icon: "fa-solid fa-eye" },
            { key: "getProductJourney", label: "Get Product Journey", icon: "fa-solid fa-route" }
          ].map(({ key, label, icon }) => (
            <li
              key={key}
              className={`farm-nav-item ${activeSection === key ? "active" : ""}`}
              onClick={() => setActiveSection(key)}
            >
              <i className={icon}></i> {label}
            </li>
          ))}
          <li className="farm-nav-item logout" onClick={handleLogout}>
            <i className="fa-solid fa-sign-out-alt"></i> Logout
          </li>
        </ul>
       
      <h2>Connect to MetaMask</h2>
      {isConnected ? (
        <div>
          <h4>Connected to MetaMask</h4>
          <p>Address: {address}</p>
        </div>
      ) : (
        <p>Connecting to MetaMask...</p>
      )}
    <div className="metamaskcontainer">
      <h2>Connect to MetaMask</h2>
      {isConnected ? (
        <div>
          <h4>Connected to MetaMask</h4>
          <p>Address: {address}</p>
        </div>
      ) : (
        <p>Connecting to MetaMask...</p>
      )}
    </div>
      </div>
      <div className="farm-main-content ">
        {activeSection === "insertDetails" && (
          <div className="farm-form-container">
            <h4>Insert Details:</h4>
            <form onSubmit={(e) => { e.preventDefault(); handleAddProductDetails(); }}>
              <div className="farm-form-grid">
                {Object.keys(formData).map((key) =>
                  key !== "imageUrl" ? (
                    <div key={key} className="farm-form-group">
                      <input
                        type="text"  // Keep as text initially
                        placeholder={
                          key === "mfgDate" ? "Enter Mfg Date" :
                            key === "expiryDate" ? "Enter Expiry Date" :
                              `Enter ${key.replace(/([A-Z])/g, " $1").trim()}`
                        }
                        name={key}
                        value={formData[key]}
                        onChange={handleChange}
                        onFocus={(e) => {
                          if (key.includes("Date")) {
                            e.target.type = "date";
                            e.target.showPicker(); // Opens the date picker immediately
                          }
                        }}
                        onBlur={(e) => {
                          if (key.includes("Date") && !e.target.value) {
                            e.target.type = "text";
                          }
                        }}
                        required
                      />
                    </div>
                  ) : null
                )}
                <div className="farm-form-group image-upload">
                  <label>Upload Product Image:</label>
                  <input
                    id="imageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange} // ✅ Use the new function
                  />
                </div>
              </div>
              <button className="farm-form-group-submit" id="submit" type="submit">Insert Details</button>

            </form>
          </div>
        )}
        {activeSection === "viewInsertedDetails" && (
          <div className="farm-details-container">
            <div className="farm-product-cards">
              {insertedDetails.length > 0 ? (
                insertedDetails.map((detail, index) => (
                  <div key={index} className="farm-product-card">
                    {detail.imageUrl && (
                      <img
                        src={detail.imageUrl}
                        alt="Product"
                        className="farm-product-image" width="100" height="100"
                      />
                    )}
                    <div className="farm-product-details">
                      <h5><i className="fas fa-barcode"></i> Product ID: {detail.productId}</h5>
                      <p><i className="fas fa-tag"></i> <strong>Name:</strong> {detail.name}</p>
                      <p><i className="fas fa-map-marker-alt"></i> <strong>Location:</strong> {detail.location}</p>
                      <p><i className="fas fa-box"></i> <strong>Quantity:</strong> {detail.quantity}</p>
                      <p><i className="fas fa-dollar-sign"></i> <strong>Price:</strong> {detail.price}</p>
                      <p><i className="fas fa-cube"></i> <strong>Product Name:</strong> {detail.productName}</p>
                      <p><i className="fas fa-hashtag"></i> <strong>Batch No:</strong> {detail.batchNo}</p>
                      <p><i className="fas fa-calendar-alt"></i> <strong>Mfg Date:</strong> {detail.mfgDate}</p>
                      <p><i className="fas fa-calendar-times"></i> <strong>Expiry Date:</strong> {detail.expiryDate}</p>
                    </div>

                  </div>
                ))
              ) : (
                <p className="Nodetails">No product details inserted yet.</p>
              )}
            </div>
          </div>
        )}
        {activeSection === "getProductJourney" && (
          <div className="farm-journey-container">
            <div className="journey-box">
              <h4>Product Journey</h4>
              <div className="farm-enter-prod-ID">
                <input
                  className='farm-input'
                  type="text"
                  name="productId"
                  placeholder="Enter Product ID"
                  value={formData.productId}
                  onChange={handleChange}
                  required
                />
              </div>
              <button className="farm-btn-primary" onClick={handleGetProductJourney} disabled={!formData.productId.trim()}>
                <i className="fa-solid fa-route"></i> Fetch Journey
              </button>

              {productJourney ? (
                <div className="farm-journey-timeline">
                  <h4>Your Product Journey</h4>
                  <ul className="farm-timeline">
                    <li>
                      <div className="farm-timeline-content">
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
        )}
      </div>
    </div>
  );
}
export default Homepage;




