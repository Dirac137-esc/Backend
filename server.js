require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database_connection');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/foods', require('./routes/food.routes'));
app.use('/api/menus', require('./routes/menu.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/users', require('./routes/user.routes'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
