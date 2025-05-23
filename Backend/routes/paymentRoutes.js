const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
    createPayment,
    getPaymentById,
    getPaymentsByDateRange
} = require('../controllers/paymentController');

// Protected routes
router.use(auth);

// Payment routes
router.post('/', createPayment);
router.get('/:id', getPaymentById);
router.get('/range', getPaymentsByDateRange);

module.exports = router; 