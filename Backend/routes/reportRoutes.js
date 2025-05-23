const express = require('express');
const router = express.Router();
const ParkingRecord = require('../models/parkingRecord');
const { auth } = require('../middleware/auth');

// Get daily report
router.get('/daily', auth, async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({ error: 'Date is required' });
        }
        const startDate = new Date(date);
        if (isNaN(startDate)) {
            return res.status(400).json({ error: 'Invalid date format' });
        }
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        const records = await ParkingRecord.find({
            entryTime: { $gte: startDate, $lte: endDate },
            exitTime: { $exists: true }
        }).populate('plateNumber', 'plateNumber');

        // Calculate summary
        const totalRecords = records.length;
        const totalAmount = records.reduce((sum, record) => sum + (record.amountPaid || 0), 0);
        const averageDuration = records.reduce((sum, record) => {
            const duration = (record.exitTime - record.entryTime) / (1000 * 60 * 60); // in hours
            return sum + duration;
        }, 0) / (totalRecords || 1);

        res.json({
            records,
            summary: {
                totalRecords,
                totalAmount,
                averageDuration: parseFloat(averageDuration.toFixed(2))
            }
        });
    } catch (error) {
        console.error('Daily report error:', error);
        res.status(500).json({ error: 'Error generating daily report' });
    }
});

// Get monthly report
router.get('/monthly', auth, async (req, res) => {
    try {
        const { year, month } = req.query;
        if (!year || !month) {
            return res.status(400).json({ error: 'Year and month are required' });
        }

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const records = await ParkingRecord.find({
            entryTime: { $gte: startDate, $lte: endDate },
            exitTime: { $exists: true }
        }).populate('plateNumber', 'plateNumber');

        // Calculate summary
        const totalRecords = records.length;
        const totalAmount = records.reduce((sum, record) => sum + (record.amountPaid || 0), 0);
        const averageDuration = records.reduce((sum, record) => {
            const duration = (record.exitTime - record.entryTime) / (1000 * 60 * 60); // in hours
            return sum + duration;
        }, 0) / (totalRecords || 1);

        res.json({
            records,
            summary: {
                totalRecords,
                totalAmount,
                averageDuration: parseFloat(averageDuration.toFixed(2))
            }
        });
    } catch (error) {
        console.error('Monthly report error:', error);
        res.status(500).json({ error: 'Error generating monthly report' });
    }
});

module.exports = router;