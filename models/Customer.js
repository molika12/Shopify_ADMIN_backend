const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
  customerId: { type: String, required: true }, // Shopify ID
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  createdAt: Date,
  updatedAt: Date,
});

// compound unique index to avoid duplicates across tenants
customerSchema.index({ tenantId: 1, customerId: 1 }, { unique: true });

module.exports = mongoose.model("Customer", customerSchema);
