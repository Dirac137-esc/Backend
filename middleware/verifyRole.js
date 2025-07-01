module.exports = (...allowedRoles) => (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) //эрх жагсаалтад байхгүй
        return res.status(403).json({ message: 'Forbidden' }); // 403
    next();
};
