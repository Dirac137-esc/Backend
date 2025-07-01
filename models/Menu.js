const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    weekStart:{ type: Date, required: true, unique: true },
    items:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }]
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);
