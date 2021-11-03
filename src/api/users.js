const express = require('express');
const router = express.Router();
const authMiddleware = require('../auth-middleware');
const userService = require('../../services/userService');

// Send a link to reset password
router.post('/passwordreset', (req, res) => {
    // https://firebase.google.com/docs/reference/rest/auth/#section-send-password-reset-email
    res.json({message: "Feature not implemented yet"})
})

// Get user info
router.get('/:username', express.json(), authMiddleware, async (req, res) => {
    try{
        res.json(await userService.getUser(req.params.username))
    } catch(e){
        res.send(e).code(e.code)
    }
})

// Update user info
router.post('/:username', express.json(), authMiddleware, async (req, res) => {
    const body = req.body;
    // Endpoint only available for authenticated user
    if(req.firebaseUser.username !== req.params.username)
        return res.json({message: "You can only modify your own user"}).status(403)
    // Get user data
    try{
        res.json(await userService.updateUser(req.params.username, body))
    } catch(e){
        res.json(e).status(500)
    }
})

// Get profile picture
router.post('/:username/profilepic', authMiddleware, fileUpload, async (req, res) => {
    try{
        res.json(await userService.updateProfilePicture(req.files.image.data))
    } catch(e){

    }
})

module.exports = router;