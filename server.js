require('dotenv').config();
const express = require('express');
const session      = require('express-session');
const cookieParser = require('cookie-parser');
const passport     = require('passport');
const cors = require('cors');
const connectDB = require('./config/database_connection');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());


        +app.use(cookieParser());
app.use(session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
require('./middleware/google');    // <— load GoogleStrategy

// Routes
app.use('/auth', require('./routes/auth.routes'));
app.use('/foods', require('./routes/food.routes'));
app.use('/menus', require('./routes/menu.routes'));
app.use('/orders', require('./routes/order.routes'));
app.use('/users', require('./routes/user.routes'));
app.get('/test', (req, res) => res.json({ message: 'Ажиллаж л байна даа' }));
app.use('/api', require('./routes/address.routes'));
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
