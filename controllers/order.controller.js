const Order = require('../models/Order');
const User = require('../models/User');
const Menu = require('../models/Menu');
const { isSameDay } = require('../utils/date');

exports.create = async (req, res) => {
    try {
        const {
            date,
            items,
            totalCost,
            location
        } = req.body;


        if (!location|| !location.address) {
            return res.status(400).json({ message: 'address is required' });
        }

        const orderDate = new Date(date);
        orderDate.setUTCHours(0, 0, 0, 0);

        const dayOfWeek = orderDate.getUTCDay(); // 0 = Бүтэнсайн
        const weekdays = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
        const weekday = weekdays[dayOfWeek];

        const daysSinceMonday = (dayOfWeek + 6) % 7;
        const weekStart = new Date(orderDate);
        weekStart.setUTCDate(orderDate.getUTCDate() - daysSinceMonday);
        weekStart.setUTCHours(0, 0, 0, 0);

        const menu = await Menu.findOne({ weekStart });
        if (!menu) {
            return res.status(400).json({ message: `No menu configured for the week of ${weekStart.toISOString().slice(0,10)}` });
        }

        const allowedIds = (menu.days?.[weekday] || []).map(id => id.toString());
        const invalid = items.map(i => i.food.toString()).filter(id => !allowedIds.includes(id));
        if (invalid.length) {
            return res.status(400).json({ message: `These items are not on the ${weekday} menu: ${invalid.join(', ')}` });
        }

        const order = new Order({
            user: req.user.id,
            menu: menu._id,
            weekday,
            date: orderDate,
            items,
            totalCost,
            location
        });

        await order.save();

// ene ajilj bnuu streak n test-leed vzeerei
        const user = await User.findById(req.user.id);
        let newStreak = 1;

        if (user.lastOrderDate) {
            const last = new Date(user.lastOrderDate);
            last.setHours(0, 0, 0, 0, 0);
            const yesterday = new Date(orderDate);
            yesterday.setDate(orderDate.getDate() - 1);

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


        res.status(201).json(order);
    } catch (err) {
        console.error('Error creating order:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};



exports.list = async (req, res) => {
    const filter = {};
    if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;

    const orders = await Order.find(filter)
        .populate('user')
        .populate('menu')
        .populate('items.food');

    res.json(orders);
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

