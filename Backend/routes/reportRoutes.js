const express = require('express');
const router = express.Router();
const ParkingRecord = require('../models/ParkingRecord');
const { auth } = require('../middleware/auth');

// Get all completed parking records (report)
router.get('/daily', auth, async (req, res) => {
    try {
        // Aggregate to join Car and format output
        const records = await ParkingRecord.aggregate([
            { $match: { exitTime: { $exists: true, $ne: null } } },
            {
                $lookup: {
                    from: 'cars',
                    localField: 'plateNumber',
                    foreignField: '_id',
                    as: 'car'
                }
            },
            { $unwind: { path: '$car', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    plateNumber: { $ifNull: ['$car.plateNumber', 'Unknown'] },
                    entryTime: 1,
                    exitTime: 1,
                    duration: {
                        $cond: [
                            { $and: ['$exitTime', '$entryTime'] },
                            { $divide: [{ $subtract: ['$exitTime', '$entryTime'] }, 1000 * 60 * 60] },
                            0
                        ]
                    },
                    amountPaid: { $ifNull: ['$amountPaid', 0] }
                }
            }
        ]);

        // Calculate summary
        const totalRecords = records.length;
        const totalAmount = records.reduce((sum, r) => sum + (r.amountPaid || 0), 0);
        const averageDuration = totalRecords
            ? records.reduce((sum, r) => sum + (r.duration || 0), 0) / totalRecords
            : 0;

        res.json({
            records: records.map(r => ({
                ...r,
                duration: r.duration ? r.duration.toFixed(2) : '0.00',
                amountPaid: r.amountPaid || 0
            })),
            summary: {
                totalRecords,
                totalAmount,
                averageDuration: averageDuration.toFixed(2)
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