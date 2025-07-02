const Order = require('../models/Order');
const User  = require('../models/User');
const { isSameDay } = require('../utils/date');

exports.create = async (req, res) => {
    try {

        const o = new Order({ ...req.body, user: req.user.id });
        await o.save();


        const user = await User.findById(req.user.id);


        const orderDate = new Date(o.date);
        orderDate.setHours(0,0,0,0);

        let newStreak = 1;
        if (user.lastOrderDate) {
            const last = new Date(user.lastOrderDate);
            last.setHours(0,0,0,0);


            const yesterday = new Date(orderDate);
            yesterday.setDate(yesterday.getDate() - 1);

            if (isSameDay(last, yesterday)) {

                newStreak = user.currentStreak + 1;
            }
        }


        user.currentStreak = newStreak;
        user.lastOrderDate = orderDate;


        if (newStreak >= 5 && !user.isVIP) {
            user.isVIP = true;
        }

        await user.save();


        res.json(o);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
};

exports.list = async (req, res) => {
    const filter = {};
    if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;
    res.json(await Order.find(filter).populate('user items.food'));
};

exports.updateStatus = async (req, res) => {
    const { paymentStatus, deliveryStatus } = req.body;
    const o = await Order.findByIdAndUpdate(
        req.params.id,
        { paymentStatus, deliveryStatus },
        { new: true }
    );
    res.json(o);
};

exports.remove = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json({ message: 'Order deleted', id: order._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

