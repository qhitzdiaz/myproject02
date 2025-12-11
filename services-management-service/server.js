const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/categories', require('./routes/categories'));
app.use('/api/providers', require('./routes/providers'));
app.use('/api/services', require('./routes/services'));
app.use('/api/bookings', require('./routes/bookings'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Serbisyo24x7 Services Management Service is running' });
});

app.listen(PORT, () => {
  console.log(`Serbisyo24x7 Service running on port ${PORT}`);
});
