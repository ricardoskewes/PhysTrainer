const express = require('express');
const authMiddleware = require('./src/auth-middleware');
const path = require('path');
const mustacheExpress = require('mustache-express')

const app = express();
// JSON Middleware
app.use(express.json())
// Templates
app.set('views', 'public');
app.set('view engine', 'view.html');
app.engine('view.html', mustacheExpress());

// Routes
const users = require('./src/api/users');
const exercises = require('./src/api/exercises');
const userService = require('./services/userService');
const exerciseService = require('./services/exerciseService');

// Static files
app.use(express.static(path.join(__dirname, '/public')))
app.use('/entities', express.static(path.join(__dirname, '/entities')))

// API
app.use('/api/1/users', users);
app.use('/api/1/exercises', exercises);

// Users
app.get('/users/:username', async (req, res) => {
    try{
        const user = await userService.get({username: req.params.username});
        const exercises = await userService.getExercises(user.userID);
        res.render('user', {user, exercises})
    } catch(e){
        res.sendFile('/404.html')
    }
})

app.get('/exercises/:exerciseID', async (req, res)=>{
    try{
        const exercise = await exerciseService.get(req.params.exerciseID);
        delete exercise._ref;
        // Get json
        exercise.json = () => JSON.stringify(exercise);
        res.render('exercise', {exercise})
    } catch(e){
        res.sendFile('/404.html')
    }
})

app.listen(process.env.PORT || 8080, ()=>{
    console.log(`App listening at port ${(process.env.PORT || 8080)}`)
})