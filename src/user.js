const express = require('express');
const router = express.Router();

const authMiddleware = require('./auth-middleware');

router.get('/:username', authMiddleware, (req, res) => {
    res.end("Get user data");
})

router.post('/:username', authMiddleware, (req, res) => {
    if(req.firebaseUser.username !== req.params.username)
        return res.json({message: "You can only modify your own user"}).status(403)
    res.end("Update used data")
})

module.exports = router;