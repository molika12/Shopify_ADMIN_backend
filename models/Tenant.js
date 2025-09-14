const mongoose = require('mongoose');

const TenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  shopDomain: { type: String, required: true },
  accessToken: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Tenant', TenantSchema);
