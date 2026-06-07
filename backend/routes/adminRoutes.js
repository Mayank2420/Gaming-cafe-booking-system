const express = require('express');

const router = express.Router();

const {
  login,
  dashboard
} = require('../controllers/adminController');

const authMiddleware = require('../middleware/authMiddleware');

router.post('/login',login);

router.get(
  '/dashboard',
  authMiddleware,
  dashboard
);

module.exports = router;