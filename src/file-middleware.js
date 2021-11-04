const express = require('express');
const multer = require('multer');

const storage = multer.memoryStorage();
const fileMiddleware = multer({storage}).single('file');

module.exports = fileMiddleware;