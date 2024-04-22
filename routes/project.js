const express = require('express');
const router = express.Router();
const Project = require('../modules/projectSchema');
const multer = require('multer');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = "saf;jakl['DA;LKG09klnaf__";

const uploadMiddleware = multer({ dest: 'uploads/' })

// ROUTE 1: add the projects to database
router.post('/add', uploadMiddleware.single('file'), async (req, res) => {
    let success = false;

    const { originalname, path } = req.file;

    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);

    const { jwt_token } = req.cookies;
    jwt.verify(jwt_token, JWT_SECRET_KEY, {}, async (err, info) => {
        if (err) return res.status(400).json({ success, message: "Not a valid user" })

        const { title, summary, alt, link } = req.body;

        const projectDoc = await Project.create({
            title,
            summary,
            cover: newPath,
            alt,
            link,
            admin: info.id
        })
        res.status(200).json({ success, projectDoc });
    })
})

// ROUTE 2: fetch projects form database
router.get('/fetch', async (req, res) => {
    let success = false;
    try {
        const posts = await Project.find()
            .populate('admin', ['username'])
            .sort({ createdAt: -1 })
            .limit(20)
        res.json(posts)
    } catch (err) {
        res.status(404).json({ success, message: "Failed to fetch posts" })
        console.log(err);
    };
})




module.exports = router