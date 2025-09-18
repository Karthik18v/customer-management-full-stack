const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const Customer = require("./model/CustomerModel");
const cors = require("cors");

// Connect DB
connectDB();

const app = express();

// CORS configuration for deployment (allow all origins)
app.use(
  cors({
    origin: "*https://customer-management-full-stack-fqxj.vercel.app/", // Allow all domains (frontend can be anywhere)
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // optional, only if using cookies/auth headers
  })
);

app.use(express.json());

const port = process.env.PORT || 3000;

// Routes
app.get("/", (req, res) => res.send("Hello World!"));

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

// Update a customer
app.put("/customers/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.status(200).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete an address
app.delete("/customers/:id/addresses/:addressId", async (req, res) => {
  const { id, addressId } = req.params;
  try {
    const customer = await Customer.findById(id);
    if (!customer) return res.status(404).send("Customer not found");

    customer.addresses = customer.addresses.filter(
      (addr) => addr._id.toString() !== addressId
    );
    await customer.save();
    res.status(200).send({ message: "Address deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
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

// Update a specific address
app.put("/customers/:id/addresses/:addressId/edit", async (req, res) => {
  const { id, addressId } = req.params;
  const updatedAddress = req.body;

  try {
    const customer = await Customer.findById(id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });

    const addressIndex = customer.addresses.findIndex(
      (addr) => addr._id.toString() === addressId
    );
    if (addressIndex === -1)
      return res.status(404).json({ error: "Address not found" });

    customer.addresses[addressIndex] = updatedAddress;
    await customer.save();
    res.status(200).json(updatedAddress);
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

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
