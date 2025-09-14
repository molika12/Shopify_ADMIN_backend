exports.loginTenant = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  try {
    const tenant = await Tenant.findOne({ email });
    if (!tenant) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, tenant.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({
      success: true,
      tenantId: tenant._id,
      shopDomain: tenant.shopDomain,
      accessToken: tenant.accessToken,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
