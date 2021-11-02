const express = require('express');
const router = express.Router();
const firebase = require('../services/firebase/index')
const authMiddleware = require('../auth-middleware');
const userService = require('../services/userService');

router.get('/:username', authMiddleware, async (req, res) => {
    try{
        res.json(await userService.getUser(req.params.username))
    } catch(e){
        res.send(e).code(e.code)
    }
})

router.post('/:username', authMiddleware, (req, res) => {
    // Endpoint only available for authenticated user
    if(req.firebaseUser.username !== req.params.username)
        return res.json({message: "You can only modify your own user"}).status(403)
    // Get user data
    res.json({message: "Update used data"})
})

module.exports = router;