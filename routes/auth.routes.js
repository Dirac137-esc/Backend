const router   = require('express').Router();
const passport = require('passport');
const jwt      = require('jsonwebtoken');
const { register, login } = require('../controllers/auth.controller');

// ─── Local auth ────────────────────────────────────────────────────────────
// POST /auth/register
router.post('/register', register);

// POST /auth/login
router.post('/login', login);

// ─── Google OAuth2 ─────────────────────────────────────────────────────────

//    GET /auth/google
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);


//    GET /auth/google/callback
router.get(
    '/google/callback',
    passport.authenticate('google', { session: true, failureRedirect: '/login-failed' }),
    (req, res) => {
        console.log('🔥 Google callback: req.user =', req.user);

        const token = jwt.sign(
            { id: req.user.id, email: req.user.email, name: req.user.name },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );


        res.json({
            token,
            user: {
                id:     req.user.id,
                email:  req.user.email,
                name:   req.user.name,
                avatar: req.user.avatar
            }
        });
    }
);

// ─── Logout ─────────────────────────────────────────────────────────────────

router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        res.json({ message: 'Logged out' });
    });
});

module.exports = router;
