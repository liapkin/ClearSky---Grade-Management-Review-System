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
  
  try{ 
    const newInstitution = await db.institutions.create({
      name: name,
      tokens: 0
    });
    return res.status(200).json(newInstitution);
  }
  catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});


router.get('/:institutionId', async (req, res) => {
  const institutionId = req.params.institutionId;
  
  try {
    const institution = await db.institutions.findByPk(institutionId, {
      attributes: ['id', 'name', 'tokens']
    });
    
    if (!institution) {
      return res.status(404).json({ error: 'Institution not found' });
    }
    
    return res.json(institution);
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});


router.delete('/:institutionId', async (req, res) => {
  const institutionId = req.params.institutionId;
  
  try {
    const institution = await db.institutions.destroy({
      where: { id: institutionId }
    });
    
    if (!institution) {
      return res.status(404).json({ error: 'Institution not found' });
    }
    
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});


router.get('/:institutionId/credits', async (req, res) => {
  const institutionId = req.params.institutionId;
  
  try {
    const tokens = await db.institutions.findByPk(institutionId, {
      attributes: ['tokens']
    });
    
    return res.json(tokens);
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});

router.post('/:institutionId/credits/purchase', async (req, res) => {
  const institutionId = req.params.institutionId;
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  try {
    await db.institutions.update(
      { tokens: db.sequelize.literal(`tokens + ${amount}`) },
      { where: { id: institutionId } }
    );

    return res.json({ success: true, message: 'Credits purchased successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});


router.post('/:institutionId/credits/consume', async (req, res) => {
  const institutionId = req.params.institutionId;
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  try {
    const institution = await db.institutions.findByPk(institutionId);

    if (!institution) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    if (institution.tokens < amount) {
      return res.status(400).json({ error: 'Insufficient credits' });
    }

    await db.institutions.update(
      { tokens: db.sequelize.literal(`tokens - ${amount}`) },
      { where: { id: institutionId } }
    );

    return res.json({ success: true, message: 'Credits consumed successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
