const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get all tenants
router.get('/', async (req, res) => {
  try {
    const { status, property_id } = req.query;
    let query = `
      SELECT t.*, p.title as property_title, p.address as property_address 
      FROM tenants t
      JOIN properties p ON t.property_id = p.id
      WHERE p.owner_id = $1
    `;
    const params = [req.user.userId];
    let paramIndex = 2;

    if (status) {
      query += ` AND t.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (property_id) {
      query += ` AND t.property_id = $${paramIndex}`;
      params.push(property_id);
      paramIndex++;
    }

    query += ' ORDER BY t.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tenants:', error);
    res.status(500).json({ error: 'Failed to fetch tenants' });
  }
});

// Get single tenant
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT t.*, p.title as property_title, p.address as property_address 
       FROM tenants t
       JOIN properties p ON t.property_id = p.id
       WHERE t.id = $1 AND p.owner_id = $2`,
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching tenant:', error);
    res.status(500).json({ error: 'Failed to fetch tenant' });
  }
});

// Create new tenant
router.post('/', async (req, res) => {
  try {
    const {
      property_id,
      full_name,
      email,
      phone,
      lease_start,
      lease_end,
      rent_amount,
      deposit_amount,
      status
    } = req.body;

    // Verify property belongs to user
    const propertyCheck = await pool.query(
      'SELECT id FROM properties WHERE id = $1 AND owner_id = $2',
      [property_id, req.user.userId]
    );

    if (propertyCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Property not found or access denied' });
    }

    const result = await pool.query(
      `INSERT INTO tenants 
      (property_id, full_name, email, phone, lease_start, lease_end, rent_amount, deposit_amount, status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING *`,
      [property_id, full_name, email, phone, lease_start, lease_end, rent_amount, deposit_amount, status || 'active']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating tenant:', error);
    res.status(500).json({ error: 'Failed to create tenant' });
  }
});

// Update tenant
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      full_name,
      email,
      phone,
      lease_start,
      lease_end,
      rent_amount,
      deposit_amount,
      status
    } = req.body;

    const result = await pool.query(
      `UPDATE tenants t
      SET full_name = $1, email = $2, phone = $3, lease_start = $4, lease_end = $5,
          rent_amount = $6, deposit_amount = $7, status = $8, updated_at = CURRENT_TIMESTAMP
      FROM properties p
      WHERE t.id = $9 AND t.property_id = p.id AND p.owner_id = $10
      RETURNING t.*`,
      [full_name, email, phone, lease_start, lease_end, rent_amount, deposit_amount, status, id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating tenant:', error);
    res.status(500).json({ error: 'Failed to update tenant' });
  }
});

// Delete tenant
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `DELETE FROM tenants t
       USING properties p
       WHERE t.id = $1 AND t.property_id = p.id AND p.owner_id = $2
       RETURNING t.id`,
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    res.json({ message: 'Tenant deleted successfully', id: result.rows[0].id });
  } catch (error) {
    console.error('Error deleting tenant:', error);
    res.status(500).json({ error: 'Failed to delete tenant' });
  }
});

module.exports = router;
