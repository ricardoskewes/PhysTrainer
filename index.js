const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const mustacheExpress = require('mustache-express')

// Init express app
const app = express();
app.use(express.json());
app.use(cookieParser());

// API endpoints
const apiPaths = require('./src/api');
const authenticationMiddleware = require('./src/middleware/authentication');
const userService = require('./services/userService');
const exerciseService = require('./services/exerciseService');
app.use('/api/v1', apiPaths);

// Templates and views
app.set('views', 'views');
app.set('view engine', 'view.html');
app.engine('view.html', mustacheExpress());

// Login
app.get('/login', (req, res)=>{
    res.render('login');
});
// Logout
app.get('/logout', authenticationMiddleware.logout, (req, res)=>{
    res.redirect('/login');
});
// User profile
app.get('/users/:username', authenticationMiddleware.verify, async (req, res) => {
    const username = req.params.username;
    try{
        const user = await userService.get({username});
        const exercises = await userService.getExercises(user.userID);
        res.render('user', {user, exercises});
    } catch(e){
        // console.log(e);
        console.log('Could not load users page because', e)
        res.render('404');
    }
})
// Exercise page
app.get('/exercises/:exerciseID', authenticationMiddleware.verify, async (req, res) => {
    const exerciseID = req.params.exerciseID;
    try{
        const exercise = await exerciseService.get(exerciseID);
        delete exercise._ref;
        exercise.locked = exercise.author.authorID != req.firebaseUser?.uid;
        exercise.json = () => JSON.stringify(exercise);
        res.render('exercise', {exercise});
    } catch(e){
        console.log('Could not load exercises page because', e)

        res.render('404');
    }
})

// Public static endpoints
app.use(express.static('public'))

// Listen to port
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Live at port ${PORT}`)
})