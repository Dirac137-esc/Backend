const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, // хэрэглэгчийн ID
        ref: 'User',
        required: true
    },
    date: {
        type: Date,                           // Захиалга хийсэн огноо
        required: true
    },
    items: [                                  // Захиалгад орсон хоолнуудын жагсаалт
        {
            food: {
                type: mongoose.Schema.Types.ObjectId, // Хоолны ID
                ref: 'Food'                           // 'Food' схем төрлийн
            },
            qty: Number
        }
    ],
    totalCost: {
        type: Number,                             // нийт үнийн дүн
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refund'],      // Төлбөрийн төлөв
        default: 'pending'
    },
    deliveryStatus: {
        type: String,
        enum: ['pending', 'delivering', 'complete'], // Хүргэлтийн төлөв
        default: 'pending'
    }
}, {
    timestamps: true // createdAt ба updatedAt
});


module.exports = mongoose.model('Order', orderSchema);
