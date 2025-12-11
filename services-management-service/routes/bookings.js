const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, s.title as service_title, p.name as provider_name
       FROM service_bookings b
       LEFT JOIN services s ON b.service_id = s.id
       LEFT JOIN service_providers p ON b.provider_id = p.id
       ORDER BY b.booking_date DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get single booking
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, s.title as service_title, p.name as provider_name
       FROM service_bookings b
       LEFT JOIN services s ON b.service_id = s.id
       LEFT JOIN service_providers p ON b.provider_id = p.id
       WHERE b.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Create booking
router.post('/', async (req, res) => {
  try {
    const { booking_code, service_id, provider_id, customer_name, customer_email, customer_phone, booking_date, booking_time, duration_hours, total_price } = req.body;
    
    if (!booking_code || !service_id || !provider_id || !customer_name || !booking_date) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const result = await pool.query(
      `INSERT INTO service_bookings (booking_code, service_id, provider_id, customer_name, customer_email, customer_phone, booking_date, booking_time, duration_hours, total_price) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING *`,
      [booking_code, service_id, provider_id, customer_name, customer_email, customer_phone, booking_date, booking_time, duration_hours, total_price]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Booking code already exists' });
    }
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Update booking
router.put('/:id', async (req, res) => {
  try {
    const { booking_date, booking_time, duration_hours, total_price, status, payment_status, special_requests } = req.body;
    
    const result = await pool.query(
      `UPDATE service_bookings 
       SET booking_date = COALESCE($1, booking_date),
           booking_time = COALESCE($2, booking_time),
           duration_hours = COALESCE($3, duration_hours),
           total_price = COALESCE($4, total_price),
           status = COALESCE($5, status),
           payment_status = COALESCE($6, payment_status),
           special_requests = COALESCE($7, special_requests),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [booking_date, booking_time, duration_hours, total_price, status, payment_status, special_requests, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// Delete booking
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM service_bookings WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

module.exports = router;
