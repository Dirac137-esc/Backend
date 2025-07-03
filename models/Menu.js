// models/Menu.js
const mongoose = require('mongoose');

const weekdayNames = [
    'monday','tuesday','wednesday','thursday',
    'friday','saturday','sunday'
];

const daysSchema = {};
weekdayNames.forEach(day => {
    daysSchema[day] = [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }];
});

const menuSchema = new mongoose.Schema({
    weekStart: {
        type: Date,
        required: true,
        unique: true
    },
    days: {
        type: new mongoose.Schema(daysSchema, { _id: false }),
        default: () => {

            const obj = {};
            weekdayNames.forEach(d => (obj[d] = []));
            return obj;
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);
