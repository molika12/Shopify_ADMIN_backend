const express = require('express');
const router = express.Router();
const { signupTenant, loginTenant } = require('../controllers/authController');

// POST /signup → calls your signupTenant function
router.post('/signup', signupTenant);

// POST /login → calls your loginTenant function
router.post('/login', loginTenant);

module.exports = router;
