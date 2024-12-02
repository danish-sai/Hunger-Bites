const express = require('express');
const fs = require('fs');
const router = express.Router();

// File path for admin data
const adminFilePath = './backend/data/admins.json';

// Get Admins
router.get('/admins', (req, res) => {
  fs.readFile(adminFilePath, (err, data) => {
    if (err) res.status(500).json({ error: 'Unable to read admin data' });
    else res.json(JSON.parse(data));
  });
});

// Add Admin
router.post('/admins', (req, res) => {
  const newAdmin = req.body;

  fs.readFile(adminFilePath, (err, data) => {
    if (err) return res.status(500).json({ error: 'Unable to read admin data' });

    const admins = JSON.parse(data);
    admins.push(newAdmin);

    fs.writeFile(adminFilePath, JSON.stringify(admins, null, 2), (writeErr) => {
      if (writeErr) return res.status(500).json({ error: 'Unable to save admin data' });
      res.json({ message: 'Admin added successfully' });
    });
  });
});

module.exports = router;
