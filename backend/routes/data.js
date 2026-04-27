const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/users', async (req, res) => {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
});

router.get('/events', async (req, res) => {
    const result = await pool.query('SELECT * FROM events');
    res.json(result.rows);
});

router.get('/schedules', async (req, res) => {
    const result = await pool.query('SELECT * FROM schedules');
    res.json(result.rows);
});

router.get('/schedule-hosts', async (req, res) => {
    const result = await pool.query('SELECT * FROM schedule_hosts');
    res.json(result.rows);
});

router.get('/participants', async (req, res) => {
    const result = await pool.query('SELECT * FROM event_participants');
    res.json(result.rows);
});

module.exports = router;