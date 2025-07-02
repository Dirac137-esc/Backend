const Menu = require('../models/Menu');

exports.list = async (req, res) => {
    res.json(await Menu.find().populate('items'));
};

exports.create = async (req, res) => {
    const menu = new Menu(req.body);
    await menu.save();
    res.json(menu);
};
exports.update = async (req, res) => {
    try {
        const updated = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).send({ message: 'Меню олдсонгүй' });
        res.send(updated);
    } catch (err) {
        res.status(500).send({ message: err.message });
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


exports.thisWeek = async (req, res) => {

    const today = new Date();

    const dayOfWeek = today.getDay();
    const daysSinceMonday = (dayOfWeek + 6) % 7;

    const monday = new Date(today);
    monday.setDate(today.getDate() - daysSinceMonday);
    monday.setHours(0, 0, 0, 0);
    monday.setMinutes(0);
    monday.setSeconds(0);
    monday.setMilliseconds(0);

    try {
        const menu = await Menu.findOne({ weekStart: monday }).populate('items');

        if (!menu) {
            return res.status(404).json({ message: 'No menu found for this week.' });
        }

        res.json(menu);
    } catch (err) {
        console.error('Error fetching this week\'s menu:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};
