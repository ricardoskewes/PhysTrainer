const express = require('express');
const authMiddleware = require('./src/auth-middleware');
const path = require('path');
const eta = require('eta')

const app = express();
// JSON Middleware
app.use(express.json())
// Templates
app.engine('view.html', eta.renderFile);
app.set('view engine', 'view.html')
app.set('views', 'public')

// Routes
const users = require('./src/api/users');
const exercises = require('./src/api/exercises');
const userService = require('./services/userService');

// Static files
app.use(express.static(path.join(__dirname, '/public')))
app.use('/entities', express.static(path.join(__dirname, '/entities')))

// API
app.use('/api/1/users', users);
app.use('/api/1/exercises', exercises);

// Users
app.get('/:username', (req, res) => {
    res.render('user', {username: req.params.username})
})

app.get('/:username/exercises/:exerciseID', (req, res)=>{
    res.render('exercise', {exerciseID: req.params.exerciseID, username: req.params.username})
})

app.listen(process.env.PORT || 8080, ()=>{
    console.log(`App listening at port ${(process.env.PORT || 8080)}`)
})