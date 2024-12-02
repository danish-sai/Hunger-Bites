const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Add User Endpoint
router.post('/add-user', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const filePath = path.join(__dirname, '../data/users.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error reading users file' });
    }

    let users = [];
    if (data) {
      users = JSON.parse(data);
    }

    // Check if the user already exists
    if (users.some(user => user.username === username)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Add the new user
    users.push({ username, password });

    fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error saving user' });
      }
      res.status(200).json({ message: 'User added successfully' });
    });
  });
});

module.exports = router;
