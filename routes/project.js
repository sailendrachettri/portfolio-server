const express = require('express');
const router = express.Router();
const Project = require('../modules/projectSchema');
const Skills = require('../modules/SkillsSchema')
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
        success = true;
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
    };
})

// ROUTE 3: NOW  FETCH PROJECT AS A SINGLE PAGE TO EDIT
router.get('/fetch/:id', async (req, res) => {
    const { id } = req.params;
    const projectDoc = await Project.findById(id);
    res.json(projectDoc)
})

// ROUTE 4: edit the projects
router.put('/edit', uploadMiddleware.single('file'), async (req, res) => {
    let success = false;
    let newPath = null;

    if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
    }

    // get the user data and send to client
    const { jwt_token } = req.cookies;
    jwt.verify(jwt_token, JWT_SECRET_KEY, {}, async (err, info) => {
        // if (err) throw err;
        if (err)
            return res.status(500).json({ message: "Internal server error" })

        const { id, title, summary, alt, link } = req.body;
        const projectDoc = await Project.findById(id);

        await projectDoc.updateOne({
            title,
            summary,
            alt,
            link,
            cover: newPath ? newPath : projectDoc.cover
        });

        success = true;
        res.json({ projectDoc, success });

    });

})

// ROUTE 5: add skills
router.post('/addskills', async (req, res) => {
    let success = false;

    try {
        const { skillname, highlight } = req.body

        const data = await Skills.create({
            skillname,
            highlight
        })

        success = true;
        res.json({ success, message: "Skill added successfully!", data });
    } catch (err) {
        success = false;
        res.status(500).json({ success, message: "Failed to added skills" });
    }

})

// ROUTER 6: fetch all the skills
router.get('/fetchskills', async(req, res)=>{
    let success = false;

    try{
        const skills = await Skills.find()

        success = true;
        res.status(200).json({success, skills});
        
    } catch(err){
        success = false;
        res.status(400).json({success, message: "Not able to fetch skills data"});
    }

    

})




module.exports = router