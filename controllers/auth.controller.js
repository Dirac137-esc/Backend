const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { name, phone, address, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ name, phone, address, email, password: hash });
    await user.save();
    res.json({ message: 'Бүртгэгдсэн' });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
        return res.status(401).json({ message: 'Бүртгэлгүй эсвэл мэдээлэл буруу байна' });

    const token = jwt.sign(
        { id: user._id, role: user.roles[0]},
        process.env.JWT_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRES_IN }
    );
    res.json({ token, user: { id: user._id, name: user.name,  email: user.email,role: user.roles[0],isVip: user.isVip, } });
};
