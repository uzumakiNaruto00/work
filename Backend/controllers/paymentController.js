const Payment = require('../models/Payment');
const ParkingRecord = require('../models/ParkingRecord');

// Create a new payment
exports.createPayment = async (req, res) => {
    try {
        const { recordId, paymentMethod } = req.body;

        // Check if record exists and is not already paid
        const record = await ParkingRecord.findById(recordId);
        if (!record) {
            return res.status(404).json({ error: 'Parking record not found' });
        }
        if (record.isPaid) {
            return res.status(400).json({ error: 'Record is already paid' });
        }

        // Create payment
        const payment = new Payment({
            recordId,
            amountPaid: record.amountPaid,
            paymentMethod: paymentMethod || 'Cash'
        });
        await payment.save();

        // Update record payment status
        record.isPaid = true;
        await record.save();

        res.status(201).json(payment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }
        res.json(payment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get payments by date range
exports.getPaymentsByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'startDate and endDate are required' });
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start) || isNaN(end)) {
            return res.status(400).json({ error: 'Invalid date format' });
        }
        end.setHours(23, 59, 59, 999);

        const payments = await Payment.find({
            paymentDate: { $gte: start, $lte: end }
        }).sort({ paymentDate: -1 });

        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllPayments = async (req, res) => {
    try {
        console.log('Attempting to fetch all payments...');
        const payments = await Payment.find({}).sort({ paymentDate: -1 });
        console.log('Payments fetched successfully:', payments);
        res.json(payments);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ error: error.message });
    }
};