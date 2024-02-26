const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../database/pool');
const router = express.Router();

// Registration route
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields (username, email, password) are required' });
        }
        // Create a user in your database
        await db.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, password]);
        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering user' });
    }
});

// Login route
router.post('/login', passport.authenticate('local'), (req, res) => {
    const { password, ...userWithoutPassword } = req.user;
    res.status(200).json({ message: 'Login successful', user: userWithoutPassword });
});

module.exports = router;
