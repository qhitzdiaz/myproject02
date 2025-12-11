const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all service providers
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, c.name as category_name 
       FROM service_providers p
       LEFT JOIN service_categories c ON p.category_id = c.id
       ORDER BY p.rating DESC, p.name`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch providers' });
  }
});

// Get single provider
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, c.name as category_name 
       FROM service_providers p
       LEFT JOIN service_categories c ON p.category_id = c.id
       WHERE p.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Provider not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch provider' });
  }
});

// Create provider
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, category_id, experience_years, address, city } = req.body;
    
    if (!name || !category_id) {
      return res.status(400).json({ error: 'Name and category are required' });
    }

    const result = await pool.query(
      `INSERT INTO service_providers (name, email, phone, category_id, experience_years, address, city) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [name, email, phone, category_id, experience_years, address, city]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to create provider' });
  }
});

// Update provider
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone, category_id, experience_years, address, city, rating, status } = req.body;
    
    const result = await pool.query(
      `UPDATE service_providers 
       SET name = COALESCE($1, name),
           email = COALESCE($2, email),
           phone = COALESCE($3, phone),
           category_id = COALESCE($4, category_id),
           experience_years = COALESCE($5, experience_years),
           address = COALESCE($6, address),
           city = COALESCE($7, city),
           rating = COALESCE($8, rating),
           status = COALESCE($9, status),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $10
       RETURNING *`,
      [name, email, phone, category_id, experience_years, address, city, rating, status, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Provider not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update provider' });
  }
});

// Delete provider
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM service_providers WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Provider not found' });
    }
    res.json({ message: 'Provider deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete provider' });
  }
});

module.exports = router;
