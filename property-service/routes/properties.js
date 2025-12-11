const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get all properties
router.get('/', async (req, res) => {
  try {
    const { status, property_type, city } = req.query;
    let query = 'SELECT * FROM properties WHERE owner_id = $1';
    const params = [req.user.userId];
    let paramIndex = 2;

    if (status) {
      query += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (property_type) {
      query += ` AND property_type = $${paramIndex}`;
      params.push(property_type);
      paramIndex++;
    }

    if (city) {
      query += ` AND city ILIKE $${paramIndex}`;
      params.push(`%${city}%`);
      paramIndex++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Get single property by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM properties WHERE id = $1 AND owner_id = $2',
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// Create new property
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      address,
      city,
      state,
      zip_code,
      country,
      property_type,
      status,
      price,
      bedrooms,
      bathrooms,
      square_feet,
      year_built,
      image_url
    } = req.body;

    const result = await pool.query(
      `INSERT INTO properties 
      (title, description, address, city, state, zip_code, country, property_type, status, price, bedrooms, bathrooms, square_feet, year_built, image_url, owner_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) 
      RETURNING *`,
      [title, description, address, city, state, zip_code, country || 'USA', property_type, status || 'available', price, bedrooms, bathrooms, square_feet, year_built, image_url, req.user.userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

// Update property
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      address,
      city,
      state,
      zip_code,
      country,
      property_type,
      status,
      price,
      bedrooms,
      bathrooms,
      square_feet,
      year_built,
      image_url
    } = req.body;

    const result = await pool.query(
      `UPDATE properties 
      SET title = $1, description = $2, address = $3, city = $4, state = $5, zip_code = $6, 
          country = $7, property_type = $8, status = $9, price = $10, bedrooms = $11, 
          bathrooms = $12, square_feet = $13, year_built = $14, image_url = $15, updated_at = CURRENT_TIMESTAMP
      WHERE id = $16 AND owner_id = $17
      RETURNING *`,
      [title, description, address, city, state, zip_code, country, property_type, status, price, bedrooms, bathrooms, square_feet, year_built, image_url, id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
});

// Delete property
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM properties WHERE id = $1 AND owner_id = $2 RETURNING id',
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json({ message: 'Property deleted successfully', id: result.rows[0].id });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

// Get property statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const statsQuery = `
      SELECT 
        COUNT(*) as total_properties,
        COUNT(CASE WHEN status = 'available' THEN 1 END) as available,
        COUNT(CASE WHEN status = 'rented' THEN 1 END) as rented,
        COUNT(CASE WHEN status = 'sold' THEN 1 END) as sold,
        COUNT(CASE WHEN status = 'maintenance' THEN 1 END) as maintenance,
        SUM(CASE WHEN status = 'rented' THEN price ELSE 0 END) as monthly_revenue,
        AVG(price) as avg_price
      FROM properties 
      WHERE owner_id = $1
    `;

    const result = await pool.query(statsQuery, [req.user.userId]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching property stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;
