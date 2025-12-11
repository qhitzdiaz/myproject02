const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const { authenticateToken } = require('../middleware/auth');

// Get all users
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, email, full_name, status, created_at, updated_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get single user by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, username, email, full_name, status, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, full_name, status, password } = req.body;

    let query = 'UPDATE users SET ';
    const params = [];
    let paramIndex = 1;

    if (username !== undefined) {
      query += `username = $${paramIndex}, `;
      params.push(username);
      paramIndex++;
    }

    if (email !== undefined) {
      query += `email = $${paramIndex}, `;
      params.push(email);
      paramIndex++;
    }

    if (full_name !== undefined) {
      query += `full_name = $${paramIndex}, `;
      params.push(full_name);
      paramIndex++;
    }

    if (status !== undefined) {
      query += `status = $${paramIndex}, `;
      params.push(status);
      paramIndex++;
    }

    if (password !== undefined) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += `password = $${paramIndex}, `;
      params.push(hashedPassword);
      paramIndex++;
    }

    query += `updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex}`;
    params.push(id);

    const result = await pool.query(query, params);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch and return updated user
    const updatedUser = await pool.query(
      'SELECT id, username, email, full_name, status, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );

    res.json(updatedUser.rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully', id: result.rows[0].id });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Update user status (active/inactive)
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = await pool.query(
      'UPDATE users SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, username, email, full_name, status, created_at, updated_at',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

module.exports = router;
