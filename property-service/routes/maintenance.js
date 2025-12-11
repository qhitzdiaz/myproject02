const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get all maintenance requests
router.get('/', async (req, res) => {
  try {
    const { status, priority, property_id } = req.query;
    let query = `
      SELECT mr.*, p.title as property_title, p.address as property_address,
             t.full_name as tenant_name
      FROM maintenance_requests mr
      JOIN properties p ON mr.property_id = p.id
      LEFT JOIN tenants t ON mr.tenant_id = t.id
      WHERE p.owner_id = $1
    `;
    const params = [req.user.userId];
    let paramIndex = 2;

    if (status) {
      query += ` AND mr.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (priority) {
      query += ` AND mr.priority = $${paramIndex}`;
      params.push(priority);
      paramIndex++;
    }

    if (property_id) {
      query += ` AND mr.property_id = $${paramIndex}`;
      params.push(property_id);
      paramIndex++;
    }

    query += ' ORDER BY mr.requested_date DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching maintenance requests:', error);
    res.status(500).json({ error: 'Failed to fetch maintenance requests' });
  }
});

// Create new maintenance request
router.post('/', async (req, res) => {
  try {
    const {
      property_id,
      tenant_id,
      title,
      description,
      priority,
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
      `INSERT INTO maintenance_requests 
      (property_id, tenant_id, title, description, priority, status) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *`,
      [property_id, tenant_id || null, title, description, priority || 'medium', status || 'open']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating maintenance request:', error);
    res.status(500).json({ error: 'Failed to create maintenance request' });
  }
});

// Update maintenance request
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      priority,
      status,
      completed_date,
      cost
    } = req.body;

    const result = await pool.query(
      `UPDATE maintenance_requests mr
      SET title = $1, description = $2, priority = $3, status = $4,
          completed_date = $5, cost = $6, updated_at = CURRENT_TIMESTAMP
      FROM properties p
      WHERE mr.id = $7 AND mr.property_id = p.id AND p.owner_id = $8
      RETURNING mr.*`,
      [title, description, priority, status, completed_date || null, cost || null, id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Maintenance request not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating maintenance request:', error);
    res.status(500).json({ error: 'Failed to update maintenance request' });
  }
});

// Delete maintenance request
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `DELETE FROM maintenance_requests mr
       USING properties p
       WHERE mr.id = $1 AND mr.property_id = p.id AND p.owner_id = $2
       RETURNING mr.id`,
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Maintenance request not found' });
    }

    res.json({ message: 'Maintenance request deleted successfully', id: result.rows[0].id });
  } catch (error) {
    console.error('Error deleting maintenance request:', error);
    res.status(500).json({ error: 'Failed to delete maintenance request' });
  }
});

module.exports = router;
