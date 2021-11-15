const express = require('express');
const exerciseService = require('../../services/exerciseService');
const authenticationMiddleware = require('../middleware/authentication');
const router = express.Router();

// GET /?exerciseID=
router.get('/', authenticationMiddleware.verify, async (req, res) => {
    const {exerciseID} = req.query;
    if(!exerciseID) return res.status(400).json({error: 'Missing exerciseID'});
    try{
        // Get exercise data
        const exercise = await exerciseService.get(exerciseID);
        // If exercise is authored by me
        if(exercise.author.userID == req.firebaseUser.uid) exercise.editable = true;
        // Return
        res.json(exercise);
    } catch(e){
        res.json(e).status(e.code);
    }
})

// POST /create
router.get('/create', authenticationMiddleware.verify, async (req, res) => {
    // Only for authenticated users
    const me = req.firebaseUser;
    if(me == undefined) res.status(401).json({error: 'Unauthorized'});
    try{
        // Create
        res.json(await exerciseService.create({...req.body, author}));
    } catch(e){
        res.json(e).status(e.code);
    }
})

// POST /update?exerciseID=
router.post('/update', authenticationMiddleware.verify, async (req, res) => {
    const {exerciseID} = req.query;
    if(!exerciseID) return res.status(400).json({error: 'Missing exerciseID'});
    // Only for authenticated users
    const me = req.firebaseUser;
    if(me == undefined) res.status(401).json({error: 'Unauthorized'});
    try{
        res.json(await exerciseService.update(exerciseID, req.body, me));
    } catch(e){
        res.json(e).status(e.code);
    }
})

// DELETE /delete?exerciseID
// POST /update?exerciseID=
router.delete('/delete', authenticationMiddleware.verify, async (req, res) => {
    const {exerciseID} = req.query;
    if(!exerciseID) return res.status(400).json({error: 'Missing exerciseID'});
    // Only for authenticated users
    const me = req.firebaseUser;
    if(me == undefined) res.status(401).json({error: 'Unauthorized'});
    try{
        res.json(await exerciseService.delete(exerciseID, me));
    } catch(e){
        res.json(e).status(e.code);
    }
})

module.exports = router;