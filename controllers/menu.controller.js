const validDays = new Set([
    'monday','tuesday','wednesday',
    'thursday','friday','saturday','sunday'
]);

const Menu = require('../models/Menu');

exports.create = async (req, res) => {
    try {
        const { weekStart, days = {} } = req.body;


        const fullDays = {};
        Object.keys(Menu.schema.paths.days.schema.paths).forEach(day => {
            fullDays[day] = Array.isArray(days[day]) ? days[day] : [];
        });

        const menu = new Menu({ weekStart, days: fullDays });
        await menu.save();
        res.status(201).json(menu);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: 'Menu for this week already exists' });
        }
        res.status(500).json({ message: err.message });
    }
};
exports.update = async (req, res) => {
    try {
        const { days = {}, weekStart } = req.body;
        const fullDays = {};
        Object.keys(Menu.schema.paths.days.schema.paths).forEach(day => {
            fullDays[day] = Array.isArray(days[day]) ? days[day] : undefined;

        });

        const updated = await Menu.findByIdAndUpdate(
            req.params.id,
            {
                ...(weekStart && { weekStart }),
                days: fullDays
            },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Menu not found' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.list = async (req, res) => {
    const menus = await Menu.find()
        .populate(Object.keys(Menu.schema.paths.days.schema.paths)
            .map(d => `days.${d}`));
    res.json(menus);
};

exports.thisWeek = async (req, res) => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const daysSinceMonday = (today.getUTCDay() + 6) % 7;

    const weekStart = new Date(today);
    weekStart.setUTCDate(today.getUTCDate() - daysSinceMonday);
    weekStart.setUTCHours(0, 0, 0, 0);

    try {
        const menu = await Menu.findOne({ weekStart })
            .populate(Object.keys(Menu.schema.paths.days.schema.paths)
                .map(d => `days.${d}`));

        if (!menu) {
            return res.status(404).json({
                message: `No menu this week for ${weekStart.toISOString().slice(0, 10)}`
            });
        }

        res.json(menu);
    } catch (err) {
        console.error('Error in thisWeek:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.removeDayItem = async (req, res) => {
    try {
        const { id, day, foodId } = req.params;
        if (!validDays.has(day)) {
            return res.status(400).json({ message: 'Invalid day' });
        }

        const menu = await Menu.findById(id);
        if (!menu) return res.status(404).json({ message: 'Menu not found' });


        menu.days[day] = menu.days[day].filter(f => f.toString() !== foodId);
        await menu.save();


        await menu.populate(`days.${day}`);

        res.json({
            message: `Removed from ${day}`,
            [day]: menu.days[day]
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.remove = async (req, res) => {
    try {
        const deleted = await Menu.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).send({ message: 'Меню олдсонгүй' });
        res.send({ message: 'Меню устгагдсан' });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};
exports.addDayItem = async (req, res) => {
    const { id, day, foodId } = req.params;
    if (!validDays.has(day)) {
        return res.status(400).json({ message: 'Invalid day name' });
    }
    try {
        const menu = await Menu.findById(id);
        if (!menu) return res.status(404).json({ message: 'Menu not found' });

        if (!menu.days[day].some(f => f.toString() === foodId)) {
            menu.days[day].push(foodId);
            await menu.save();
        }

        await menu.populate(`days.${day}`);
        res.json({ day, items: menu.days[day] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
