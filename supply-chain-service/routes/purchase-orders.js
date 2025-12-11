const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all purchase orders
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT po.*, s.name as supplier_name 
       FROM purchase_orders po
       LEFT JOIN suppliers s ON po.supplier_id = s.id
       ORDER BY po.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch purchase orders' });
  }
});

// Get single purchase order with items
router.get('/:id', async (req, res) => {
  try {
    const poResult = await pool.query(
      `SELECT po.*, s.name as supplier_name 
       FROM purchase_orders po
       LEFT JOIN suppliers s ON po.supplier_id = s.id
       WHERE po.id = $1`,
      [req.params.id]
    );
    
    if (poResult.rows.length === 0) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }

    const itemsResult = await pool.query(
      `SELECT poi.*, p.name as product_name, p.sku
       FROM purchase_order_items poi
       LEFT JOIN products p ON poi.product_id = p.id
       WHERE poi.po_id = $1`,
      [req.params.id]
    );

    const po = poResult.rows[0];
    po.items = itemsResult.rows;
    res.json(po);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch purchase order' });
  }
});

// Create purchase order
router.post('/', async (req, res) => {
  try {
    const { po_number, supplier_id, order_date, expected_delivery, total_amount, items } = req.body;
    
    if (!po_number || !supplier_id || !order_date) {
      return res.status(400).json({ error: 'PO number, supplier, and order date are required' });
    }

    const poResult = await pool.query(
      `INSERT INTO purchase_orders (po_number, supplier_id, order_date, expected_delivery, total_amount) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [po_number, supplier_id, order_date, expected_delivery, total_amount]
    );

    const po = poResult.rows[0];

    // Add items if provided
    if (items && items.length > 0) {
      for (const item of items) {
        await pool.query(
          `INSERT INTO purchase_order_items (po_id, product_id, quantity, unit_price, line_total)
           VALUES ($1, $2, $3, $4, $5)`,
          [po.id, item.product_id, item.quantity, item.unit_price, item.line_total]
        );
      }
    }

    res.status(201).json(po);
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'PO number already exists' });
    }
    res.status(500).json({ error: 'Failed to create purchase order' });
  }
});

// Update purchase order
router.put('/:id', async (req, res) => {
  try {
    const { po_number, supplier_id, order_date, expected_delivery, actual_delivery, total_amount, status, notes } = req.body;
    
    const result = await pool.query(
      `UPDATE purchase_orders 
       SET po_number = COALESCE($1, po_number),
           supplier_id = COALESCE($2, supplier_id),
           order_date = COALESCE($3, order_date),
           expected_delivery = COALESCE($4, expected_delivery),
           actual_delivery = COALESCE($5, actual_delivery),
           total_amount = COALESCE($6, total_amount),
           status = COALESCE($7, status),
           notes = COALESCE($8, notes),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [po_number, supplier_id, order_date, expected_delivery, actual_delivery, total_amount, status, notes, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update purchase order' });
  }
});

// Delete purchase order
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM purchase_orders WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }
    res.json({ message: 'Purchase order deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete purchase order' });
  }
});

module.exports = router;
