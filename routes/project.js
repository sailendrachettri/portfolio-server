const express = require('express');
const router = express.Router();
const Project = require('../modules/projectSchema');
const multer = require('multer');
const fs = require('fs');
const jwt = require('jsonwebtoken');

router.post('/add', (req, res)=>{
    res.status(200).json({title: "Title"})
})

module.exports = router