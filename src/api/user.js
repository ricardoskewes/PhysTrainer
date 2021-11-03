const express = require('express');
const router = express.Router();
const firebase = require('../../firebase/index')
const authMiddleware = require('../auth-middleware');
const userService = require('../../services/userService');
const firebaseOptions = require('../../firebase/config.json')

router.get('/:username', express.json(), authMiddleware, async (req, res) => {
    try{
        res.json(await userService.getUser(req.params.username))
    } catch(e){
        res.send(e).code(e.code)
    }
})

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

router.post('/passwordreset', (req, res) => {
    // https://firebase.google.com/docs/reference/rest/auth/#section-send-password-reset-email
    res.redirect(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${firebaseOptions.apiKey}`)
})

module.exports = router;