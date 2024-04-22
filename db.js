const mongoose = require('mongoose')

let connect = mongoose.connect('mongodb://localhost:27017/devportfolio');

connect.then(()=>{
    console.log("Database connected successfully");
}).catch(()=>{
    console.log("Database connection FAILED :(");
})