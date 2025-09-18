const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const Customer = require("./model/CustomerModel");
const cors = require("cors");

// Connect DB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/customers", async (req, res) => {
  console.log(req.body);

  try {
    const customer = new Customer(req.body); // ✅ now works
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/customers/:id/addresses", async (req, res) => {
  console.log(req.body);
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const newAddress = req.body;
    customer.addresses.push(newAddress);
    await customer.save();
    res.status(201).json(newAddress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/customers/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/customers/:id", async (req, res) => {
  console.log(req.params.id, req.body);
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE address by id
app.delete("/customers/:id/addresses/:addressId", async (req, res) => {
  const { id, addressId } = req.params;
  console.log("Deleting address:", addressId, "for customer:", id);

  try {
    const customer = await Customer.findById(id);
    if (!customer) return res.status(404).send("Customer not found");

    // Remove the address from the array
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

app.get("/customers/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/customers/:id/addresses/:addressId/edit", async (req, res) => {
  const { id, addressId } = req.params;
  const updatedAddress = req.body;

  try {
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const addressIndex = customer.addresses.findIndex(
      (addr) => addr._id.toString() === addressId
    );
    if (addressIndex === -1) {
      return res.status(404).json({ error: "Address not found" });
    }

    customer.addresses[addressIndex] = updatedAddress;
    await customer.save();
    res.status(200).json(updatedAddress);
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

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
