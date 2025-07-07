// utils/getWeekDates.js
function getWeekDates(weekStart) {
    const dates = {};
    const start = new Date(weekStart);

    const weekdayNames = [
        'monday', 'tuesday', 'wednesday', 'thursday',
        'friday', 'saturday', 'sunday'
    ];

    weekdayNames.forEach((day, i) => {
        const date = new Date(start); // clone
        date.setDate(start.getDate() + i);
        dates[day] = date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    });

    return dates;
}

module.exports = getWeekDates;
