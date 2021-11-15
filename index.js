const express = require('express');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
const authenticationMiddleware = require('./src/middleware/authentication');

// Init express app
const app = express();
app.use(express.json());
app.use(cookieParser());

// Authentication endpoint
const authenticationPaths = require('./src/api/authentication');
app.use('/api/v1/authentication', authenticationPaths);

// Users endpoints
const userPaths = require('./src/api/users');
app.use('/api/v1/users', userPaths);

// Exercises endpoints
const exercisePaths = require('./src/api/exercises');
app.use('/api/v1/exercises', exercisePaths);

app.get('/test', authenticationMiddleware.verify, (req, res)=>{
    res.end(req.firebaseUser?.email || 'You need to log in');
});

app.get('/logout', (req, res)=>{
    res.redirect('//api/v1/authentication/logout')
})

app.use(express.static('public'))


// Listen to port
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Live at port ${PORT}`)
})