const express = require('express');
const authenticationMiddleware = require('../middleware/authentication');
const router = express.Router();

router.post('/login', authenticationMiddleware.login, (req, res)=>{
    res.json({message: 'Success'});
})

router.get('/logout', authenticationMiddleware.logout, (req, res)=>{
    res.json({message: 'Success'})
})

router.get('/resetpassword', (req, res)=>{
    const {email} = req.query.email;
    if(!email)
        return res.status(400).json({error: 'Missing email address'})
    res.json({message: 'Method coming soon'})
})

module.exports = router;
