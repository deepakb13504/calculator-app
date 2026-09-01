require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5005;

app.use(cors());
app.use(express.json());

// Get all calculations
app.get('/api/calculations', async (req, res) => {
  try {
    const calculations = await prisma.calculation.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20 // Only fetch the 20 most recent
    });
    res.json(calculations);
  } catch (error) {
    console.error('Error fetching calculations:', error);
    res.status(500).json({ error: 'Failed to fetch calculations' });
  }
});

// Save a calculation
app.post('/api/calculations', async (req, res) => {
  const { expression, result } = req.body;
  if (!expression || !result) {
    return res.status(400).json({ error: 'Expression and result are required' });
  }
  
  try {
    const newCalculation = await prisma.calculation.create({
      data: {
        expression,
        result
      }
    });
    res.status(201).json(newCalculation);
  } catch (error) {
    console.error('Error saving calculation:', error);
    res.status(500).json({ error: 'Failed to save calculation' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
