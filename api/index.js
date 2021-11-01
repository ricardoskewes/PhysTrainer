const express = require('express');
const authMiddleware = require('./auth-middleware');
const app = express();

app.use('/', authMiddleware);

app.get('/test', (req, res)=>{
    res.send("hi")
})

app.listen(process.env.PORT || 8080, ()=>{
    console.log(`App listening at port ${(process.env.PORT || 8080)}`)
})