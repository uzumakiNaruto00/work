const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
    createCar,
    getAllCars,
    getCarByPlate,
    updateCar,
    deleteCar
} = require('../controllers/carController');

// Protected routes
router.use(auth);

// Car routes
router.post('/', createCar);
router.get('/', getAllCars);
router.get('/:plateNumber', getCarByPlate);
router.put('/:plateNumber', updateCar);
router.delete('/:plateNumber', deleteCar);

module.exports = router; 