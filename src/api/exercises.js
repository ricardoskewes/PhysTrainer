const express = require('express');
const exerciseService = require('../../services/exerciseService');
const router = express.Router();
const authMiddleware = require('../auth-middleware');

// POST /api/1/exercises/create
router.post('/create', authMiddleware, async (req, res) => {
    console.dir(req.body)
    try{
        res.json(
            await exerciseService.create({
                author: req.firebaseUser._ref, 
                title: req.body.title
            })
        )
    } catch(e){
        res.json(e).status(e.code)
    }
})

// POST /api/1/exercises/update?exerciseID=
router.post('/update', authMiddleware, async (req, res) => {
    if(!req.query.exerciseID) return res.json({error: "Provide an exerciseID"}).status(400)
    try{
        // Get exercise
        const exercise = await exerciseService.get(req);
        // If exercise does not belong to user throw error
        if(exercise.author.userID != req.firebaseUser.userID)
            res.json({error: "Unauthorized. Only the author can update"}).status(401)
        // Update
        await exercise._ref.withConverter(exerciseService.converter).update()
    } catch(e){

    }
})


router.get('/:exerciseID', authMiddleware, async (req, res) => {
    res.json({message: "Get data from exercise id"});
})

router.post('/:exerciseID', authMiddleware, async (req, res) => {
    res.json({message: "Update exercise data"});
})


module.exports = router;