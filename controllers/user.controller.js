const User = require('../models/User');
const Order = require('../models/Order');

exports.list = async (req, res) => {
    res.json(await User.find());
};

exports.getProfile = async (req, res) => {
    const user = await User.findById(req.user.id);
    const orders = await Order.find({ user: req.user.id });
    res.json({ user, orders });
};
