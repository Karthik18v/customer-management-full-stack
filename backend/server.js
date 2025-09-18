const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const Customer = require("./model/CustomerModel");
const cors = require("cors");

// ------------------
// MongoDB Connection
// ------------------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

// Connect DB
connectDB();

// ------------------
// Express App
// ------------------
const app = express();

// Middleware
app.use(express.json());

// CORS setup for frontend
const allowedOrigins = [
  "https://customer-management-full-stack-fqxj.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman / server-to-server
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

// ------------------
// Routes
// ------------------

// Test route
app.get("/", (req, res) => res.send("🚀 Server is running!"));

// Customers CRUD
app.post("/customers", async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/customers", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/customers/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.status(200).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/customers/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.status(200).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/customers/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Addresses
app.post("/customers/:id/addresses", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });

    // Ensure ObjectId for address
    const newAddress = { _id: new mongoose.Types.ObjectId(), ...req.body };
    customer.addresses.push(newAddress);
    await customer.save();
    res.status(201).json(newAddress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/customers/:id/addresses/:addressId", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });

    const index = customer.addresses.findIndex(addr => addr._id.toString() === req.params.addressId);
    if (index === -1) return res.status(404).json({ error: "Address not found" });

    // Update fields
    customer.addresses[index] = { ...customer.addresses[index]._doc, ...req.body };
    await customer.save();
    res.status(200).json(customer.addresses[index]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/customers/:id/addresses/:addressId", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send("Customer not found");

    customer.addresses = customer.addresses.filter(addr => addr._id.toString() !== req.params.addressId);
    await customer.save();
    res.status(200).send({ message: "Address deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// ------------------
// Vercel Serverless Export
// ------------------
module.exports = app;// Customer Routes
// ------------------

// Create a new customer
app.post("/customers", async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all customers
app.get("/customers", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get a single customer
app.get("/customers/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.status(200).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a customer
app.put("/customers/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.status(200).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a customer
app.delete("/customers/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add a new address to a customer
app.post("/customers/:id/addresses", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });

    const newAddress = req.body;
    customer.addresses.push(newAddress);
    await customer.save();
    res.status(201).json(newAddress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a specific address
app.put("/customers/:id/addresses/:addressId", async (req, res) => {
  const { id, addressId } = req.params;
  const updatedAddress = req.body;

  try {
    const customer = await Customer.findById(id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });

    const index = customer.addresses.findIndex(addr => addr._id.toString() === addressId);
    if (index === -1) return res.status(404).json({ error: "Address not found" });

    customer.addresses[index] = updatedAddress;
    await customer.save();
    res.status(200).json(updatedAddress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a specific address
app.delete("/customers/:id/addresses/:addressId", async (req, res) => {
  const { id, addressId } = req.params;
  try {
    const customer = await Customer.findById(id);
    if (!customer) return res.status(404).send("Customer not found");

    customer.addresses = customer.addresses.filter(addr => addr._id.toString() !== addressId);
    await customer.save();
    res.status(200).send({ message: "Address deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// ------------------
// Start server (Vercel-friendly)
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
