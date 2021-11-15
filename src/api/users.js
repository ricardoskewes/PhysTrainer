const express = require('express');
const userService = require('../../services/userService');
const authenticationMiddleware = require('../middleware/authentication');
const router = express.Router();

// GET /me
// Gets info about the current user
router.get('/me', authenticationMiddleware.verify, async (req, res)=>{
    const me = req.firebaseUser;
    if(me == undefined) res.status(401).json({error: 'Unauthorized'});
    // Get user by id
    const user = await userService.get({userID: me.uid});
    // Return data
    res.json(user); 
})

// GET /data?userID=
// GET /data?username=
router.get('/info', authenticationMiddleware.verify, async (req, res)=>{
    const {userID, username} = req.query;
    if(!userID && !username)
        return res.status(400).json({error: 'Specify a username or userID'});
    try{
        // Get user
        const user = await userService.get({userID, username});
        // Do something if user is authenticated user
        if(user.userID == req.firebaseUser?.uid) {}
        // Return user
        res.json(user);
    } catch(e){
        res.json(e).status(e.code)
    }
})

// GET /exercises?userID=
router.get('/exercises', authenticationMiddleware.verify, async (req, res)=>{
    const {userID} = req.query;
    if(!userID)
        return res.status(400).json({error: 'Specify a userID'});
    try{
        // Get exercises
        const exercises = await userService.getExercises(userID);
        // Return exercises
        res.json(exercises);
    } catch(e){
        res.json(e).status(e.code);
    }
})

// POST /update
router.post('/update', authenticationMiddleware.verify, async (req, res)=>{
    const me = req.firebaseUser;
    if(me == undefined) res.status(404).json({error: 'Unauthorized'});
    try{
        // Update with data from body
        res.json(await userService.update(req.firebaseUser.uid, req.body));
    } catch(e){
        res.json(e).status(e.code);
    }
})

// POST /profile-pictue
router.post('/profile-picture', authenticationMiddleware.verify, async (req, res)=>{
    const me = req.firebaseUser;
    if(me == undefined) res.status(404).json({error: 'Unauthorized'});
    res.json({message: 'Method coming soon'})
})

module.exports = router;
