const express = require('express');
const multer = require('multer');

const fileMiddleware = multer({dest: 'temp-uploads/'})

module.exports = fileMiddleware;