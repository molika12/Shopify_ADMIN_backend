const express = require("express");
const router = express.Router();
const Tenant = require("../models/Tenant");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, shopDomain } = req.body;

    const existing = await Tenant.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const tenant = new Tenant({
      name,
      email,
      password: hashedPassword,
      shopDomain,
    });

    await tenant.save();

    res.json({ message: "Tenant registered successfully", tenantId: tenant._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const tenant = await Tenant.findOne({ email });
    if (!tenant) return res.status(400).json({ message: "Invalid credentials" });

    const validPassword = await bcrypt.compare(password, tenant.password);
    if (!validPassword) return res.status(400).json({ message: "Invalid credentials" });

    res.json({ message: "Login successful", tenantId: tenant._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

