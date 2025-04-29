import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import multer from 'multer';
//import fs from 'fs';
import path from 'path';



const App = express()
App.use(express.json())
App.use(express.urlencoded())
App.use(cors());



/////
App.use("/uploads", express.static("uploads")); // Serve static files
////////////////////

// Connect to MongoDB(for checking connection with backend)
mongoose.connect('mongodb://localhost:27017/myLoginRegisterDb3', { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to MongoDB');
    // Any code that depends on the database connection should go here
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });


const farmerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
})
const distributorSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
})
const wholesalerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
})
const retailorSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
})
const consumerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
})

const productSchema = new mongoose.Schema({
  productId: String,
  name: String,
  location: String,
  quantity: Number,
  price: Number,
  productName: String,
  batchNo: Number,
  mfgDate: String,
  expiryDate: String,
  image: String, // Store image filename
});


const Farmer = new mongoose.model("Farmer", farmerSchema);

const Distributor = new mongoose.model("Distributor", distributorSchema);

const Wholesaler = new mongoose.model("Wholesaler", wholesalerSchema);

const Retailor = new mongoose.model("Retailor", retailorSchema);

const Consumer = new mongoose.model("Consumer", consumerSchema);

const Product = mongoose.model('Product', productSchema);

//farmer register
App.post("/FARMER/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if Farmer already exists
    const existingFarmer = await Farmer.findOne({ email: email });
    if (existingFarmer) {
      // Farmer already exists
      return res.send({ message: "Farmer already registered" });

    } else {
      // Create a new Farmer
      const newFarmer = new Farmer({
        name,
        email,
        password
      });
      // Save the new Farmer
      await newFarmer.save();
      // Farmer successfully registered
      return res.send({ message: "Successfully registered Please login now" });
    }
  } catch (error) {
    // Handle any errors
    return res.status(500).send({ error: error.message });
  }
});
// for login farmer
App.post("/FARMER/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the Farmer with the provided email
    const farmer = await Farmer.findOne({ email: email });

    if (farmer) {
      //Farmer found, check if the password matches
      if (password === farmer.password) {
        // Password matches, send success message and Farmer data
        return res.send({ success : true ,message: "Login successful", farmer: farmer });

      } else {
        // Password doesn't match, send message
        return res.send({ success : false ,message: "Password didn't match" });
      }
    } else {
      // Farmer not found, send message
      return res.send({ success : false,message: "farmer not registered" });
    }
  } catch (error) {
    // Handle any errors
    return res.status(500).send({ success : false,error: error.message });
  }
});

//distributor register
App.post("/DISTRIBUTOR/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if Distributor already exists
    const existingDistributor = await Distributor.findOne({ email: email });
    if (existingDistributor) {
      // Distributor already exists
      return res.send({ message: "Distributor already registered" });

    } else {
      // Create a newDistributorr
      const newDistributor = new Distributor({
        name,
        email,
        password
      });
      // Save the new Distributor
      await newDistributor.save();
      // Distributor successfully registered
      return res.send({ message: "Successfully registered Please login now" });
    }
  } catch (error) {
    // Handle any errors
    return res.status(500).send({ error: error.message });
  }
});

// for login distributor
App.post("/DISTRIBUTOR/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the distributor with the provided email
    const distributor = await Distributor.findOne({ email: email });

    if (distributor) {
      //distributor found, check if the password matches
      if (password === distributor.password) {
        // Password matches, send success message and distributor data
        return res.send({ message: " Distributor Login successful", distributor: distributor });

      } else {
        // Password doesn't match, send message
        return res.send({ message: "Password didn't match" });
      }
    } else {
      // distributor not found, send message
      return res.send({ message: "distributor not registered" });
    }
  } catch (error) {
    // Handle any errors
    return res.status(500).send({ error: error.message });
  }
});

//wholesaler register
App.post("/WHOLESALER/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if Wholesaler already exists
    const existingWholesaler = await Wholesaler.findOne({ email: email });
    if (existingWholesaler) {
      // Wholesaler already exists
      return res.send({ message: "Wholesaler already registered" });

    } else {
      // Create a newWholesalerr
      const newWholesaler = new Wholesaler({
        name,
        email,
        password
      });
      // Save the new Wholesaler
      await newWholesaler.save();
      // Wholesaler successfully registered
      return res.send({ message: "Successfully registered Please login now" });
    }
  } catch (error) {
    // Handle any errors
    return res.status(500).send({ error: error.message });
  }
});

// for login wholesaler
App.post("/WHOLESALER/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the wholesaler with the provided email
    const wholesaler = await Wholesaler.findOne({ email: email });

    if (wholesaler) {
      //wholesaler found, check if the password matches
      if (password === wholesaler.password) {
        // Password matches, send success message and wholesaler data
        return res.send({ message: " wholesaler Login successful", wholesaler: wholesaler });

      } else {
        // Password doesn't match, send message
        return res.send({ message: "Password didn't match" });
      }
    } else {
      // wholesaler not found, send message
      return res.send({ message: "wholesaler not registered" });
    }
  } catch (error) {
    // Handle any errors
    return res.status(500).send({ error: error.message });
  }
});

//retailor register
App.post("/RETAILOR/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if Retailor already exists
    const existingRetailor = await Retailor.findOne({ email: email });
    if (existingRetailor) {
      // Retailor already exists
      return res.send({ message: "Retailor already registered" });

    } else {
      // Create a newDRetailor
      const newRetailor = new Retailor({
        name,
        email,
        password
      });
      // Save the new Retailor
      await newRetailor.save();
      // Retailor successfully registered
      return res.send({ message: " Retailor Successfully registered Please login now" });
    }
  } catch (error) {
    // Handle any errors
    return res.status(500).send({ error: error.message });
  }
});

// for login retailor
App.post("/RETAILOR/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the retailor with the provided email
    const retailor = await Retailor.findOne({ email: email });

    if (retailor) {
      //retailor found, check if the password matches
      if (password === retailor.password) {
        // Password matches, send success message and retailor data
        return res.send({ message: "Retailor Login successful", retailor: retailor });

      } else {
        // Password doesn't match, send message
        return res.send({ message: "Password didn't match" });
      }
    } else {
      // retailor not found, send message
      return res.send({ message: "retailor not registered" });
    }
  } catch (error) {
    // Handle any errors
    return res.status(500).send({ error: error.message });
  }
});

//consumer register
App.post("/CONSUMER/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if Consumer already exists
    const existingConsumer = await Consumer.findOne({ email: email });
    if (existingConsumer) {
      // Consumer already exists
      return res.send({ message: "Consumer already registered" });

    } else {
      // Create a newDConsumer
      const newConsumer = new Consumer({
        name,
        email,
        password
      });
      // Save the new Consumer
      await newConsumer.save();
      // Consumer successfully registered
      return res.send({ message: " Consumer Successfully registered Please login now" });
    }
  } catch (error) {
    // Handle any errors
    return res.status(500).send({ error: error.message });
  }
});

// for login retailor
App.post("/CONSUMER/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the consumer with the provided email
    const consumer = await Consumer.findOne({ email: email });

    if (consumer) {
      //consumer found, check if the password matches
      if (password === consumer.password) {
        // Password matches, send success message and retailor data
        return res.send({ message: "consumer Login successful", consumer: consumer });

      } else {
        // Password doesn't match, send message
        return res.send({ message: "Password didn't match" });
      }
    } else {
      // consumer not found, send message
      return res.send({ message: "consumer not registered" });
    }
  } catch (error) {
    // Handle any errors
    return res.status(500).send({ error: error.message });
  }
});

/////////////////////////////////////////////////////////////

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage })


///////////////////////////////////////////////////////////////////////
App.post("/api/products", upload.single("image"), async (req, res) => {
  try {
    // console.log("Request received:", req.body); // ✅ Debug log
    // console.log("Uploaded Image File:", req.file);


    if (!req.file) {
      return res.status(400).json({ error: "Image upload failed!" });
    }

    const productData = JSON.parse(req.body.productData); // Parse product data
    // console.log("Parsed productData:", productData); // ✅ Debug log

    // Ensure all required fields are present
    if (!productData.productId || !productData.name || !productData.price) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create a new product entry
    const newProduct = new Product({
      productId: productData.productId,
      name: productData.name,
      location: productData.location || "",
      quantity: productData.quantity ? Number(productData.quantity) : 0,
      price: productData.price ? Number(productData.price) : 0,
      productName: productData.productName || "",
      batchNo: productData.batchNo ? Number(productData.batchNo) : 0,
      mfgDate: productData.mfgDate || "",
      expiryDate: productData.expiryDate || "",
      imageUrl: `/uploads/${req.file.filename}`, // ✅ Save image path
    });

    const savedProduct = await newProduct.save();

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    // console.log("Saved product:", savedProduct); // ✅ Debug log
    // console.log("Returning image URL:", imageUrl); // ✅ Debug log

    // ✅ Send back the complete product object with image URL
    res.status(201).json({ ...savedProduct.toObject(), imageUrl });

  } catch (error) {
    console.error("MongoDB Save Error:", error);
    res.status(500).json({ error: "Failed to save in MongoDB" });
  }
});











App.listen(9002, () => {
  console.log("db started at port 9002");
});



