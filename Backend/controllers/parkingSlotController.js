const ParkingSlot = require('../models/ParkingSlot');

// Create a new parking slot
exports.createParkingSlot = async (req, res) => {
    try {
        const parkingSlot = new ParkingSlot(req.body);
        await parkingSlot.save();
        res.status(201).json(parkingSlot);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all parking slots
exports.getAllParkingSlots = async (req, res) => {
    try {
        const parkingSlots = await ParkingSlot.find({});
        res.json(parkingSlots);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get parking slot by slot number
exports.getParkingSlotByNumber = async (req, res) => {
    try {
        const parkingSlot = await ParkingSlot.findOne({ slotNumber: req.params.slotNumber });
        if (!parkingSlot) {
            return res.status(404).json({ error: 'Parking slot not found' });
        }
        res.json(parkingSlot);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update parking slot status
exports.updateParkingSlotStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['Available', 'Occupied'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const parkingSlot = await ParkingSlot.findOneAndUpdate(
            { slotNumber: req.params.slotNumber },
            { status },
            { new: true, runValidators: true }
        );

        if (!parkingSlot) {
            return res.status(404).json({ error: 'Parking slot not found' });
        }
        res.json(parkingSlot);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete parking slot
exports.deleteParkingSlot = async (req, res) => {
    try {
        const parkingSlot = await ParkingSlot.findOneAndDelete({ slotNumber: req.params.slotNumber });
        if (!parkingSlot) {
            return res.status(404).json({ error: 'Parking slot not found' });
        }
        res.json({ message: 'Parking slot deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 