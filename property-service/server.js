const express = require('express');
const cors = require('cors');
require('dotenv').config();

const auth = require('./middleware/auth');
const propertiesRoutes = require('./routes/properties');
const tenantsRoutes = require('./routes/tenants');
const maintenanceRoutes = require('./routes/maintenance');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'property-service' });
});

// Routes - all protected by auth middleware
app.use('/api/properties', auth, propertiesRoutes);
app.use('/api/tenants', auth, tenantsRoutes);
app.use('/api/maintenance', auth, maintenanceRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Property service running on port ${PORT}`);
});
