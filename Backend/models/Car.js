const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    plateNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    ownerName: {
        type: String,
        required: true,
        trim: true
    },
    contactInfo: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Car', carSchema); 