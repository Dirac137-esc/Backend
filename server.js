require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database_connection');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', require('./routes/auth.routes'));
app.use('/foods', require('./routes/food.routes'));
app.use('/menus', require('./routes/menu.routes'));
app.use('/orders', require('./routes/order.routes'));
app.use('/users', require('./routes/user.routes'));
app.get('/test', (req, res) => res.json({ message: 'It works' }));
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
