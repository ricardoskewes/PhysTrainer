const express = require('express');
const router = express.Router();
const authMiddleware = require('../auth-middleware');
const userService = require('../../services/userService');
const fileMiddleware = require('../file-middleware');

// Send a link to reset password
router.post('/passwordreset', (req, res) => {
    // https://firebase.google.com/docs/reference/rest/auth/#section-send-password-reset-email
    res.json({message: "Feature not implemented yet"})
})

// Get user info
router.get('/:userID', express.json(), authMiddleware, async (req, res) => {
    try{
        res.json(await userService.get(req.params.userID))
    } catch(e){
        res.send(e).code(e.code)
    }
})

// Update user info
router.post('/:userID', express.json(), authMiddleware, async (req, res) => {
    const body = req.body;
    // Endpoint only available for authenticated user
    if(req.firebaseUser.userID !== req.params.userID) return res.json({message: "You can only modify your own user"}).status(403)
    // Update user data
    try{
        res.json(await userService.update(req.params.userID, body))
    } catch(e){
        res.json(e).status(e.code)
    }
})

// Update profile picture
router.post('/:userID/profilepic', authMiddleware, fileMiddleware, async (req, res) => {
    const file = req.file;
    // Endpoint only available for authenticated user
    if(req.firebaseUser.userID !== req.params.userID) return res.json({message: "You can only modify your own user"}).status(403)
    // Update user data
    try{
        res.json(await userService.uploadProfilePicture(req.query.userID, file))
    } catch(e){
        res.json(e).status(e.code)
    }
})

// Get user exercises
router.get('/:userID/exercises', authMiddleware, async (req, res) => {
    try{
        res.json(await userService.getExercises(req.query.userID))
    } catch(e){
        res.json(e).status(e.code)
    }
})

module.exports = router;