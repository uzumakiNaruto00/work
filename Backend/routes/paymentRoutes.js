const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
    createPayment,
    getPaymentById,
    getPaymentsByDateRange,
    getAllPayments
} = require('../controllers/paymentController');

// Protected routes
router.use(auth);

// Payment routes
router.post('/', createPayment);
router.get('/:id', getPaymentById);
router.get('/range', getPaymentsByDateRange);
router.get('/all', getAllPayments);

module.exports = router;