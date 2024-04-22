const express = require('express');
const router = express.Router();
const Admin = require('../modules/AdminSchema');
const bcryptjs = require('bcryptjs')
const salt = bcryptjs.genSaltSync(10);

router.post('/create', async(req, res)=>{
    let success = false;
    const {username, password, cpassword} = req.body;

    if(password != cpassword) return res.status(400).json({success, message : "Password didn'n match"});

    const user = await Admin.findOne({username});

    if(user) return res.status(400).json({success, message: "User already exist"});

    const userDoc = await Admin.create({
        username, 
        password : bcryptjs.hashSync(password, salt)
    })

    success = true;
    res.status(200).json({success, message : 'User created successfully!', username: userDoc.username});
    
})

module.exports = router