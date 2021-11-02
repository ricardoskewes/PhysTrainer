const express = require('express');
const router = express.Router();
const firebase = require('../firebase/index')
const authMiddleware = require('../auth-middleware');

router.get('/:username', authMiddleware, async (req, res) => {
    // Get user data
    const query = await firebase.firestore().collection('users').where("username", "==", req.params.username).get();
    if(query.empty) return res.json({message: "User not found"}).status(404)
    const user = query.docs[0].data();
    res.json(user);
})

router.post('/:username', authMiddleware, (req, res) => {
    // Endpoint only available for authenticated user
    if(req.firebaseUser.username !== req.params.username)
        return res.json({message: "You can only modify your own user"}).status(403)
    // Get user data
    res.json({message: "Update used data"})
})

module.exports = router;