const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    menu: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu',
        required: true
    },
    weekday: {
        type: String,
        enum: ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'],
        required: true
    },
    date: {
        type: Date,
        required: true
    },

    items: [
        {
            food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
            qty: Number
        }
    ],
    totalCost: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending','paid','refund'],
        default: 'pending'
    },
    deliveryStatus: {
        type: String,
        enum: ['pending','delivering','complete'],
        default: 'pending'
    },
    location: {
        latitude: {
            type: Number,
            required: [true, 'Latitude is required']
        },
        longitude: {
            type: Number,
            required: [true, 'Longitude is required']
        },
        address: {
            type: String,
            required: [true, 'Address is required'],
            trim: true
        },
        additionalNote: {
            type: String,
            default: ''
        }
    }

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
