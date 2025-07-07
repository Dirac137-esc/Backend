const mongoose = require('mongoose');
const getWeekDates = require('../utils/week_days_assigning');

const weekdayNames = [
    'monday', 'tuesday', 'wednesday', 'thursday',
    'friday', 'saturday', 'sunday'
];


const daysSchema = {};
weekdayNames.forEach(day => {
    daysSchema[day] = [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }];
});

const menuSchema = new mongoose.Schema({
    weekStart: {
        type: Date,
        required: true,
        unique: true,
        validate: {
            validator: function(value) {
                return value.getDay() === 1;
            },
            message: props => `${props.value.toDateString()} .`
        }
    },
    days: {
        type: new mongoose.Schema(daysSchema, { _id: false }),
        default: () => {
            const obj = {};
            weekdayNames.forEach(day => (obj[day] = []));
            return obj;
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


menuSchema.virtual('weekDates').get(function () {
    return getWeekDates(this.weekStart);
});

module.exports = mongoose.model('Menu', menuSchema);
