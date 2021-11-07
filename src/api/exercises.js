const express = require('express');
const exerciseService = require('../../services/exerciseService');
const router = express.Router();
const authMiddleware = require('../auth-middleware');

// GET /api/1/exercises?exerciseID=
router.get('/', authMiddleware, async (req, res) => {
    if(!req.query.exerciseID) return res.json({error: "Provide an exerciseID"}).status(400)
    try{
        res.json(await exerciseService.get(req.query.exerciseID));
    } catch(e){
        res.json(e).status(e.code)
    }
})


// POST /api/1/exercises/create
router.post('/create', authMiddleware, async (req, res) => {
    if(req.firebaseUser == undefined) res.send("Unauthorized").status(403)
    const author = req.firebaseUser._ref;
    const title = req.body.title;
    try{
        // Create
        res.json(await exerciseService.create({author, title}))
    } catch(e){
        res.json(e).status(e.code)
    }
})

// POST /api/1/exercises/update?exerciseID=
router.post('/update', authMiddleware, async (req, res) => {
    if(req.firebaseUser == undefined) res.send("Unauthorized").status(403)
    if(!req.query.exerciseID) return res.json({error: "Provide an exerciseID"}).status(400)
    try{
        res.json(await exerciseService.update(req.query.exerciseID, req.body, req.firebaseUser))
    } catch(e){
        res.json(e).status(e.code)
    }
})

// DELETE /api/1/exercices/delete?exerciseID=
router.delete('/delete', authMiddleware, async (req, res) => {
    if(req.firebaseUser == undefined) res.send("Unauthorized").status(403)
    if(!req.query.exerciseID) return res.json({error: "Provide an exerciseID"}).status(400)
    try{
        res.json(await exerciseService.delete(req.query.exerciseID, req.firebaseUser))
    } catch(e){
        res.json(e).status(e.code)
    }
})

module.exports = router;