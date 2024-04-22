const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const projectSchema = new Schema({
    title : String,
    summary: String,
    link : String,
    cover : String,
    alt : String,
    admin : {type: Schema.Types.ObjectId, ref: 'Admin'},
}, {
    timestamps : true
})

const projectModel = mongoose.model('projects', projectSchema);
module.exports = projectModel