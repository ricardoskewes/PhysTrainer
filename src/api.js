/**
 * /api/v1/...
 * This script routes all the different endpoints provided by the API
 */

const express = require('express');
const router = express.Router();

// Authentication endpoints
const authenticationPaths = require('./api/authentication');
router.use('/authentication', authenticationPaths);

// Users endpoints
const userPaths = require('./api/users');
router.use('/users', userPaths);

// Exercises endpoints
const exercisePaths = require('./api/exercises');
router.use('/exercises', exercisePaths);

// Default path
router.get('/', (req, res)=>{
    res.end('Please specify a path. Check documentation on GitHub.')
})

module.exports = router;