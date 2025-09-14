const express = require('express');
const router = express.Router();
const { signupTenant, loginTenant } = require('../controllers/authController.js');

router.post('/signup', signupTenant);
router.post('/login', loginTenant);

module.exports = router;
