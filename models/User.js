const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,           // Хэрэглэгчийн нэр
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true        // Давхардахгүй
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true            // Давхардахгүй
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: [String],         // эрх
        default: ['user']
    },
    isVIP: {
        type: Boolean,          // VIP хэрэглэгч эсэх
        default: false
    },
    Streak: { type: Number, default: 0 },   //streak дараалан захиалга хийсэн тоо
    lastOrderDate: { type: Date }
}, {
    timestamps: true           // createdAt ба updatedAt
});


module.exports = mongoose.model('User', userSchema);
