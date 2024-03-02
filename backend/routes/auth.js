const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../database/pool');
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields (username, email, password) are required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a user in your database
        await db.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, hashedPassword]);
        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering user' });
    }
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    const { password, ...userWithoutPassword } = req.user;
    res.status(200).json({ message: 'Login successful', user: userWithoutPassword });
});

router.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) {
            console.error('Error logging out:', err);
            res.status(500).json({ message: 'Error logging out' });
        } else {
            res.status(200).json({ message: 'Logout successful' });
        }
    });
});

router.get('/check-auth', (req, res) => {
    if (req.isAuthenticated()) {
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }
});

module.exports = router;
