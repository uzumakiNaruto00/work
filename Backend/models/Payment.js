const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    recordId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'ParkingRecord'
    },
    amountPaid: {
        type: Number,
        required: true
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Card', 'Mobile Money'],
        default: 'Cash'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema); 