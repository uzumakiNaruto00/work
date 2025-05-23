const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
    createParkingSlot,
    getAllParkingSlots,
    getParkingSlotByNumber,
    updateParkingSlotStatus,
    deleteParkingSlot
} = require('../controllers/parkingSlotController');

// Protected routes
router.use(auth);

// Parking slot routes
router.post('/', createParkingSlot);
router.get('/', getAllParkingSlots);
router.get('/:slotNumber', getParkingSlotByNumber);
router.put('/:slotNumber/status', updateParkingSlotStatus);
router.delete('/:slotNumber', deleteParkingSlot);

module.exports = router; 