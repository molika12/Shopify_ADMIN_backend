const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Tenant = require('../models/Tenant');


const generateToken = (tenantId) => {
  return jwt.sign({ id: tenantId }, process.env.JWT_SECRET || 'secretkey', {
    expiresIn: '7d',
  });
};

const signupTenant = async (req, res) => {
  try {
    const { name, email, password, shopDomain, accessToken } = req.body;

    if (!name || !email || !password || !shopDomain || !accessToken) {
      return res
        .status(400)
        .json({ success: false, message: 'All fields are required' });
    }

    const existingTenant = await Tenant.findOne({ email });
    if (existingTenant) {
      return res
        .status(400)
        .json({ success: false, message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const tenant = await Tenant.create({
      name,
      email,
      password: hashedPassword,
      shopDomain,
      accessToken,
    });

    const token = generateToken(tenant._id);

    res.status(201).json({
      success: true,
      message: 'Signup successful',
      tenant: {
        _id: tenant._id,
        name: tenant.name,
        email: tenant.email,
        shopDomain: tenant.shopDomain,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const loginTenant = async (req, res) => {
  try {
    const { email, password } = req.body;

    const tenant = await Tenant.findOne({ email });
    if (!tenant) {
      return res
        .status(400)
        .json({ success: false, message: 'Tenant not found' });
    }

    const isMatch = await bcrypt.compare(password, tenant.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: 'Incorrect password' });
    }

    const token = generateToken(tenant._id);

    res.json({
      success: true,
      message: 'Login successful',
      tenant: {
        _id: tenant._id,
        name: tenant.name,
        email: tenant.email,
        shopDomain: tenant.shopDomain,
         accessToken: tenant.accessToken,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { signupTenant, loginTenant };

