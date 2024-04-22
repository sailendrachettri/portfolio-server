const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const projectSchema = new Schema({
    title : String,
    summary: String,
    link : String,
    cover : String,
    alt : String,
}, {
    timestamps : true
})

const projectModel = mongoose.model('projects', projectSchema);
module.exports = projectModel