const jwt = require('jsonwebtoken');
// JWT шалгах middleware
module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization']; // Authorization header-аас token-ийг авна
    if (!authHeader)
        return res.status(401).json({ message: 'No token' });
    const token = authHeader.split(' ')[1]; //"Bearer token"

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {  //TOKEN-ийг key-тэй тааруулж шалгана
        if (err) return res.status(403).json({ message: 'token chin aldaatai bnaa' });
        req.user = user;
        next(); // route шилжилт
    });
};

