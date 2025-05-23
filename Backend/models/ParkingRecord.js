const mongoose = require('mongoose');

const parkingRecordSchema = new mongoose.Schema({
    plateNumber: {
        type: String,
        required: true,
        ref: 'Car'
    },
    slotNumber: {
        type: String,
        required: true,
        ref: 'ParkingSlot'
    },
    entryTime: {
        type: Date,
        required: true,
        default: Date.now
    },
    exitTime: {
        type: Date
    },
    duration: {
        type: Number, // Duration in hours
        default: 0
    },
    amountPaid: {
        type: Number,
        default: 0
    },
    isPaid: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Calculate duration and amount before saving
parkingRecordSchema.pre('save', function(next) {
    if (this.exitTime) {
        const durationMs = this.exitTime - this.entryTime;
        const durationHours = Math.ceil(durationMs / (1000 * 60 * 60));
        this.duration = durationHours;
        this.amountPaid = Math.max(500, durationHours * 500); // Minimum 500 RWF
    }
    next();
});

// Fix: Prevent OverwriteModelError
module.exports = mongoose.models.ParkingRecord || mongoose.model('ParkingRecord', parkingRecordSchema);