const express = require('express');
const router = express.Router();
const db = require('../database/pool');
const bcrypt = require('bcrypt');

// GET all users
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM users');
        const users = result.rows;
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving users' });
    }
});

// GET user by ID
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
        const user = result.rows[0];
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving user' });
    }
});

// PUT (update) user by ID
router.put('/:userId', async (req, res) => {
    const { userId } = req.params;
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.query('UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4', [username, email, hashedPassword, userId]);
        
        if (result.rowCount > 0) {
            res.json({ message: 'User updated successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating user' });
    }
});

module.exports = router;
