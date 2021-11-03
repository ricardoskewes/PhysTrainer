const express = require('express');
const authMiddleware = require('./src/auth-middleware');
const path = require('path');
const app = express();

app.use(express.json())

// Routes
const user = require('./src/api/user');

// Static files
app.use(express.static(path.join(__dirname, '/public')))
app.use('/entities', express.static(path.join(__dirname, '/entities')))

app.use('/api/1/users', user);

app.listen(process.env.PORT || 8080, ()=>{
    console.log(`App listening at port ${(process.env.PORT || 8080)}`)
})