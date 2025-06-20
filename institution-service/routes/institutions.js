const express = require('express');
const db = require('../models');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
      const [rows] = await db.institutions.findAll({
        attributes: [
          'id',
          'name',
          'tokens',
        ],
        });
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});


router.post('/', async (req, res) => {
  const { name, address, contactEmail } = req.body;
  const [result] = await pool.query(
    'INSERT INTO institutions (name,address,contact_email,created_at,representative_id) VALUES (?, ?, ?, NOW(), ?)',
    [name, address, contactEmail, null]  // no auth => null representative
  );
  const institutionId = result.insertId;
  // initialize credits
  await pool.query(
    'INSERT INTO credits (institution_id,balance) VALUES (?, 0)',
    [institutionId]
  );
  const [rows] = await pool.query(
    'SELECT institution_id AS institutionId, name, address, contact_email AS contactEmail, created_at AS createdAt FROM institutions WHERE institution_id = ?',
    [institutionId]
  );
  res
    .status(201)
    .location(`/institutions/${institutionId}`)
    .json(rows[0]);
});

// 3. Get one institution’s details
//    GET /institutions/:institutionId
router.get('/:institutionId', async (req, res) => {
  const [rows] = await pool.query(
    'SELECT institution_id AS institutionId, name, address, contact_email AS contactEmail, created_at AS createdAt FROM institutions WHERE institution_id = ?',
    [req.params.institutionId]
  );
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

// 4. Delete an institution
//    DELETE /institutions/:institutionId
router.delete('/:institutionId', async (req, res) => {
  await pool.query('DELETE FROM credits WHERE institution_id = ?', [
    req.params.institutionId
  ]);
  await pool.query('DELETE FROM institutions WHERE institution_id = ?', [
    req.params.institutionId
  ]);
  res.status(204).send();
});

// 5. Get credit balance
//    GET /institutions/:institutionId/credits
router.get('/:institutionId/credits', async (req, res) => {
  const [rows] = await pool.query(
    'SELECT balance FROM credits WHERE institution_id = ?',
    [req.params.institutionId]
  );
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json({
    institutionId: req.params.institutionId,
    creditBalance: rows[0].balance
  });
});

// 6. Purchase credits
//    POST /institutions/:institutionId/credits/purchase
router.post('/:institutionId/credits/purchase', async (req, res) => {
  const { amount } = req.body;
  await pool.query(
    'UPDATE credits SET balance = balance + ? WHERE institution_id = ?',
    [amount, req.params.institutionId]
  );
  const [rows] = await pool.query(
    'SELECT balance FROM credits WHERE institution_id = ?',
    [req.params.institutionId]
  );
  res.json({ creditBalance: rows[0].balance });
});

// 7. Consume a credit
//    POST /institutions/:institutionId/credits/consume
router.post('/:institutionId/credits/consume', async (req, res) => {
  const [update] = await pool.query(
    'UPDATE credits SET balance = balance - 1 WHERE institution_id = ? AND balance > 0',
    [req.params.institutionId]
  );
  if (!update.affectedRows)
    return res.status(403).json({ error: 'Insufficient credits' });
  const [rows] = await pool.query(
    'SELECT balance FROM credits WHERE institution_id = ?',
    [req.params.institutionId]
  );
  res.json({ remainingCredits: rows[0].balance });
});

module.exports = router;
