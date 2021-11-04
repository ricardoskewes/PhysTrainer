const express = require('express');
const router = express.Router();
const authMiddleware = require('../auth-middleware');
const userService = require('../../services/userService');
const fileMiddleware = require('../file-middleware');

// POST /api/1/user/passwordreset?email=
// Send a link to reset password
router.post('/passwordreset', (req, res) => {
    // https://firebase.google.com/docs/reference/rest/auth/#section-send-password-reset-email
    res.json({message: "Feature not implemented yet"});
})

// GET /api/1/users?userID=
// GET /api/1/users?username=
// Get a specific user
router.get('/', authMiddleware, async (req, res) => {
    if(!req.query.userID && !req.query.username) return res.json({error: "Specify a username or userID"}).status(400)
    try{
        res.json(await userService.get({userID: req.query.userID, username: req.query.username}))
    } catch(e){
        res.json(e).status(e.code);
    }
})

// GET /api/1/users/exercises?userID=
// Get user exercises
router.get('/exercises', authMiddleware, async (req, res) => {
    if(!req.query.userID) return res.json({error: "Specify a userID"}).status(400);
    try{
        res.json(await userService.getExercises(req.query.userID));
    } catch(e){
        res.json(e).status(e.code);
    }
})

// POST /api/1/users/update
// Update info of current user
router.post('/update', authMiddleware, async (req, res) => {
    try{
        res.json(await userService.update(req.firebaseUser.userID, req.body));
    } catch(e){
        res.json(e).status(e.code);
    }
})

// POST /api/1/users/pic
// Upload profile picture
router.post('/pic', authMiddleware, fileMiddleware.single('profilepic'), async (req, res) => {
    try{
        res.json(await userService.uploadProfilePicture(req.firebaseUser.userID, req.file))
    } catch(e){
        res.json(e).status(e.code);
    }
})

module.exports = router;