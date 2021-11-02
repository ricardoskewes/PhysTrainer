const express = require('express');
const router = express.Router();

const authMiddleware = require('./auth-middleware');

router.get('/:username', authMiddleware, (req, res) => {
    res.json({message: req.firebaseUser})
})

module.exports = router;