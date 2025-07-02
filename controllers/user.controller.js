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


const bcrypt = require('bcryptjs');


exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, phone, address, email, password, oldPassword } = req.body;


    if (req.user.id !== id && !(req.user.roles || []).includes('admin')){
        return res.status(403).json({ message: 'Not authorized.' });
    }

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found.' });


        if (password) {
            if (!oldPassword && !req.user.roles.includes('admin')) {
                return res.status(400).json({ message: 'Нууц үгээ солихын тулд хуучин нууц үг хэрэгтэй.' });
            }


            if (!(req.user.roles || []).includes('admin')) {
                const isMatch = await bcrypt.compare(oldPassword, user.password);
                if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect.' });
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }


        if (name !== undefined) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (address !== undefined) user.address = address;
        if (email !== undefined) user.email = email;

        await user.save();

        res.json({
            message: 'User updated successfully.',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                roles: user.roles
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
};

