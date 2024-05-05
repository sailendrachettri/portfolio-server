const {Schema, model}  = require('mongoose')

const SkillSchema = new Schema({
    skillname: String,
    highlight: String
})

const skillModel = model('skill', SkillSchema);
module.exports = skillModel;