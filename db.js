const mongoose = require('mongoose')
require('dotenv').config();

let connect = mongoose.connect(process.env.REACT_APP_MONGODB_URL);

connect.then(()=>{
    console.log("Database connected successfully");
}).catch(()=>{
    console.log("Database connection FAILED :(");
})