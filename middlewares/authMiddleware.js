const jwt = require("jsonwebtoken");
const Tenant = require("../models/Tenant"); 

const tenantMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    const tenant = await Tenant.findById(decoded.id);
    if (!tenant) {
      return res.status(401).json({ message: "Tenant not found" });
    }

    req.tenant = {
      id: tenant._id,
      name: tenant.name,
      email: tenant.email,
      shopDomain: tenant.shopDomain,
      accessToken: tenant.accessToken,
    };

    next();
  } catch (err) {
    console.error("Tenant middleware error:", err);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = tenantMiddleware;

