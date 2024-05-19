const express = require('express');
const router = express.Router();
const Admin = require('../modules/AdminSchema');
const bcryptjs = require('bcryptjs')
const salt = bcryptjs.genSaltSync(10);
const JWT_SECRET_KEY = "saf;jakl['DA;LKG09klnaf__";
const jwt = require('jsonwebtoken');

// ROUTE 1: Register the admin
router.post('/register', async (req, res) => {
    let success = false;
    const { username, password, cpassword } = req.body;

    if (password != cpassword) return res.status(400).json({ success, message: "Password didn'n match" });

    const user = await Admin.findOne({ username });

    if (user) return res.status(400).json({ success, message: "User already exist" });

    const userDoc = await Admin.create({
        username,
        password: bcryptjs.hashSync(password, salt)
    })

    success = true;
    res.status(200).json({ success, message: 'User created successfully!', username: userDoc.username });

})

// ROUTE 2: LOGINT THE ADMIN ONLY
router.post('/login', async (req, res) => {
    let success = false;

    const { username, password } = req.body;
    const user = await Admin.findOne({ username });

    if (!user) return res.status(400).json({ success, message: "User doesn't exist" });

    if (!bcryptjs.compareSync(password, user.password))
        return res.status(400).json({ success, message: "Invlaid credentials" });


    // if username and password is valid the let him logged in
    const data = {
        username,
        id: user.id
    }
    // sign jwt token with username and userid
    const jwt_token = jwt.sign(data, JWT_SECRET_KEY);

    // set details in cookies
    success = true;
    res.cookie('jwt_token', jwt_token, {
        secure: true,
        sameSite: 'none',
    }).status(200).json({ success, message: "Logged In scuessful!", jwt_token });
})

// ROUTE 3: Get all the user information (LOGGED IN)
router.get('/profile', (req, res) => {
    let success = false;
    const { jwt_token } = req.cookies;

    try {
        success = true;
        const userInfo = jwt.verify(jwt_token, JWT_SECRET_KEY);
        res.status(200).json(userInfo);

    } catch (err) {
        success = false;
        res.status(500).json({ success, message: "Internal server errorrr" })
    }
})

// ROUTE 4: Handle logout
router.post('/logout', (req, res) => {
    try {
        res.cookie('jwt_token', '').json('ok'); // removing auth_token from cookie
    } catch (err) {
        res.status(500).json(err);
    }
})
module.exports = router