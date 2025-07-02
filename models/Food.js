const mongoose = require('mongoose');
const foodSchema = new mongoose.Schema({
    name: {
        type: String,         // Хоолны нэр
        required: true
    },
    imageUrl: {             // Хоолны зурагны URL
        type: String,
        required:true
    },
    price: {
        type: Number,         // Хоолны үнэ
        required: true
    },
    ingredients: {
        type: [String],   //орц
        default: []
    }
}, {
    timestamps: true          // createdAt ба updatedAt
});


module.exports = mongoose.model('Food', foodSchema);
