const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
  orderId: { type: String, required: true },
  customerId: String,
  email: String,
  totalPrice: String,
  financialStatus: String,
  fulfillmentStatus: String,
  lineItems: Array,
  createdAt: Date,
  updatedAt: Date,
});

orderSchema.index({ tenantId: 1, orderId: 1 }, { unique: true });

module.exports = mongoose.model("Order", orderSchema);
