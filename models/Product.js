const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
  productId: { type: String, required: true },
  title: String,
  bodyHtml: String,
  vendor: String,
  price: String,
  createdAt: Date,
  updatedAt: Date,
});

productSchema.index({ tenantId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model("Product", productSchema);
