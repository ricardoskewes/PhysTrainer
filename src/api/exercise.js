const express = require('express');
const router = express.Router();
const authMiddleware = require('../auth-middleware');

router.post('/', authMiddleware, async (req, res) => {
    res.json({message: "Create a new exercise"});
})

router.get('/:exerciseID', authMiddleware, async (req, res) => {
    res.json({message: "Get data from exercise id"});
})

router.post('/:exerciseID', authMiddleware, async (req, res) => {
    res.json({message: "Update exercise data"});
})


