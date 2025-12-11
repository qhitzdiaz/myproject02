const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all services
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, c.name as category_name, p.name as provider_name, p.rating 
       FROM services s
       LEFT JOIN service_categories c ON s.category_id = c.id
       LEFT JOIN service_providers p ON s.provider_id = p.id
       ORDER BY s.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Get single service
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, c.name as category_name, p.name as provider_name, p.rating 
       FROM services s
       LEFT JOIN service_categories c ON s.category_id = c.id
       LEFT JOIN service_providers p ON s.provider_id = p.id
       WHERE s.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

// Create service
router.post('/', async (req, res) => {
  try {
    const { title, description, category_id, provider_id, price, duration_hours, tags } = req.body;
    
    if (!title || !category_id || !provider_id) {
      return res.status(400).json({ error: 'Title, category, and provider are required' });
    }

    const result = await pool.query(
      `INSERT INTO services (title, description, category_id, provider_id, price, duration_hours, tags) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [title, description, category_id, provider_id, price, duration_hours, tags]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

// Update service
router.put('/:id', async (req, res) => {
  try {
    const { title, description, category_id, provider_id, price, duration_hours, tags, status } = req.body;
    
    const result = await pool.query(
      `UPDATE services 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           category_id = COALESCE($3, category_id),
           provider_id = COALESCE($4, provider_id),
           price = COALESCE($5, price),
           duration_hours = COALESCE($6, duration_hours),
           tags = COALESCE($7, tags),
           status = COALESCE($8, status),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [title, description, category_id, provider_id, price, duration_hours, tags, status, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

// Delete service
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM services WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

module.exports = router;
