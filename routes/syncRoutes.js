const express = require("express");
const router = express.Router();
const syncController = require("../controllers/syncController");
const Tenant = require("../models/Tenant");

const tenantMiddleware = async (req, res, next) => {
  const tenantId = req.headers["x-tenant-id"];
  if (!tenantId) return res.status(400).json({ error: "Tenant ID missing" });

  const tenant = await Tenant.findById(tenantId);
  if (!tenant) return res.status(404).json({ error: "Tenant not found" });

  req.tenant = tenant;
  next();
};

router.get("/customers", tenantMiddleware, syncController.syncCustomers);
router.get("/orders", tenantMiddleware, syncController.syncOrders);
router.get("/products", tenantMiddleware, syncController.syncProducts);

module.exports = router;

