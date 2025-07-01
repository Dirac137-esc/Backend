require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database_connection');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());


app.use('/api/auth', require('./routes/auth.routes'));

app.use('/api/users', require('./routes/user.routes'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
