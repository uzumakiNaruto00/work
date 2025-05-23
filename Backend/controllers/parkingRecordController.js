const ParkingRecord = require('../models/ParkingRecord');
const ParkingSlot = require('../models/ParkingSlot');
const Payment = require('../models/Payment');

// Create a new parking record
exports.createParkingRecord = async (req, res) => {
    try {
        const { plateNumber, slotNumber } = req.body;

        // Check if slot is available
        const slot = await ParkingSlot.findOne({ slotNumber });
        if (!slot) {
            return res.status(404).json({ error: 'Parking slot not found' });
        }
        if (slot.status === 'Occupied') {
            return res.status(400).json({ error: 'Parking slot is already occupied' });
        }

        // Create parking record
        const parkingRecord = new ParkingRecord({
            plateNumber,
            slotNumber,
            entryTime: new Date()
        });
        await parkingRecord.save();

        // Update slot status
        slot.status = 'Occupied';
        await slot.save();

        res.status(201).json(parkingRecord);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all parking records
exports.getAllParkingRecords = async (req, res) => {
    try {
        const records = await ParkingRecord.find({})
            .sort({ entryTime: -1 });
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get parking record by ID
exports.getParkingRecordById = async (req, res) => {
    try {
        const record = await ParkingRecord.findById(req.params.id);
        if (!record) {
            return res.status(404).json({ error: 'Parking record not found' });
        }
        res.json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update parking record (exit time and payment)
exports.updateParkingRecord = async (req, res) => {
    try {
        const record = await ParkingRecord.findById(req.params.id);
        if (!record) {
            return res.status(404).json({ error: 'Parking record not found' });
        }

        if (record.exitTime) {
            return res.status(400).json({ error: 'Parking record already closed' });
        }

        // Set exit time
        record.exitTime = new Date();
        await record.save();

        // Create payment
        const payment = new Payment({
            recordId: record._id,
            amountPaid: record.amountPaid,
            paymentMethod: req.body.paymentMethod || 'Cash'
        });
        await payment.save();

        // Update slot status
        const slot = await ParkingSlot.findOne({ slotNumber: record.slotNumber });
        if (slot) {
            slot.status = 'Available';
            await slot.save();
        }

        res.json({ record, payment });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete parking record
exports.deleteParkingRecord = async (req, res) => {
    try {
        const record = await ParkingRecord.findById(req.params.id);
        if (!record) {
            return res.status(404).json({ error: 'Parking record not found' });
        }

        // Update slot status if record is active
        if (!record.exitTime) {
            const slot = await ParkingSlot.findOne({ slotNumber: record.slotNumber });
            if (slot) {
                slot.status = 'Available';
                await slot.save();
            }
        }

        await ParkingRecord.findByIdAndDelete(req.params.id);
        res.json({ message: 'Parking record deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get daily report
exports.getDailyReport = async (req, res) => {
    try {
        const records = await ParkingRecord.find({
            exitTime: { $exists: true }
        });

        // Calculate summary
        const totalRecords = records.length;
        const totalAmount = records.reduce((sum, record) => sum + (record.amountPaid || 0), 0);
        const averageDuration = records.reduce((sum, record) => {
            if (record.exitTime && record.entryTime) {
                const duration = (record.exitTime - record.entryTime) / (1000 * 60 * 60); // in hours
                return sum + duration;
            }
            return sum;
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
};