const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
    createParkingRecord,
    getAllParkingRecords,
    getParkingRecordById,
    updateParkingRecord,
    deleteParkingRecord,
    getDailyReport
} = require('../controllers/parkingRecordController');

// Protected routes
router.use(auth);

// Parking record routes
router.post('/', createParkingRecord);
router.get('/', getAllParkingRecords);
router.get('/report', getDailyReport);
router.get('/:id', getParkingRecordById);
router.put('/:id', updateParkingRecord);
router.delete('/:id', deleteParkingRecord);

module.exports = router; 