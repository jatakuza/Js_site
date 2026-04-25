
const express = require('express');
const router = express.Router();
console.log("Router debug:", typeof router, router);
const pool = require('../db');
console.log("AUTH FILE LOADED:", __filename);

console.log("express =", express);
console.log("typeof express =", typeof express);
console.log("express.Router =", express?.Router);

// REGISTER
router.post('/register', async (req, res) => {
    const { full_name, email, login, password, user_role } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO users (full_name, email, login, password_hash, user_role)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [full_name, email, login, password, user_role]
        );

        res.json({ message: 'User created', user: result.rows[0] });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Register error' });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    const { login, password } = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE login = $1',
            [login]
        );

        const user = result.rows[0];

        if (!user || user.password_hash !== password) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        res.json({ message: 'Login successful', user });

    } catch (err) {
        res.status(500).json({ error: 'Login error' });
    }
});

module.exports = router;