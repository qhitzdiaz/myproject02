const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/suppliers', require('./routes/suppliers'));
app.use('/api/products', require('./routes/products'));
app.use('/api/purchase-orders', require('./routes/purchase-orders'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Supply Chain Service is running' });
});

app.listen(PORT, () => {
  console.log(`Supply Chain Service running on port ${PORT}`);
});
