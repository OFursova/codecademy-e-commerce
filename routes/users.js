const express = require('express');
const router = express.Router();
const db = require('../database.js');

// GET all users
router.get('/', async (req, res) => {
    try {
        const users = await db.all('SELECT * FROM user');
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
        const user = await db.get('SELECT * FROM user WHERE id = ?', [userId]);
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
    const { name, email, password } = req.body;

    try {
        const result = await db.run('UPDATE user SET name = ?, email = ?, password = ? WHERE id = ?', [name, email, password, userId]);
        if (result.changes > 0) {
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
