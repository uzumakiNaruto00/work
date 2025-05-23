const Car = require('../models/Car');

// Create a new car
exports.createCar = async (req, res) => {
    try {
        const car = new Car(req.body);
        await car.save();
        res.status(201).json(car);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all cars
exports.getAllCars = async (req, res) => {
    try {
        const cars = await Car.find({});
        res.json(cars);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get car by plate number
exports.getCarByPlate = async (req, res) => {
    try {
        const car = await Car.findOne({ plateNumber: req.params.plateNumber });
        if (!car) {
            return res.status(404).json({ error: 'Car not found' });
        }
        res.json(car);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update car
exports.updateCar = async (req, res) => {
    try {
        const car = await Car.findOneAndUpdate(
            { plateNumber: req.params.plateNumber },
            req.body,
            { new: true, runValidators: true }
        );
        if (!car) {
            return res.status(404).json({ error: 'Car not found' });
        }
        res.json(car);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete car
exports.deleteCar = async (req, res) => {
    try {
        const car = await Car.findOneAndDelete({ plateNumber: req.params.plateNumber });
        if (!car) {
            return res.status(404).json({ error: 'Car not found' });
        }
        res.json({ message: 'Car deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 