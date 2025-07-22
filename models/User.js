const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId:   {
        type: String,
        unique: true,
        sparse: true,
    },
    avatar:     {
        type: String
    },
    name: {
        type: String,
        unique: false,// Хэрэглэгчийн нэр
        sparse: true,
        required() {
            return !this.googleId;
        }
    },
    phone: {
        type: String,
        unique: true,
        sparse:  true,
        required() {
            return !this.googleId }
    },
    address: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true            // Давхардахгүй
    },
    password: {
        type: String,
        required() {
            return !this.googleId;
        }
    },
    roles: {
        type: [String],         // эрх
        default: ['user']
    },
    isVIP: {
        type: Boolean,          // VIP хэрэглэгч эсэх
        default: false
    },
    currentStreak: { type: Number, default: 0 },   //streak дараалан захиалга хийсэн тоо
    lastOrderDate: { type: Date }
}, {
    timestamps: true           // createdAt ба updatedAt
});

module.exports = mongoose.model('User', userSchema);
