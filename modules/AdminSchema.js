const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const AdminSchema = new Schema({
    username : {
        type : String,
        unique : true
    },

    password: String
})

const Admin = model('Admin', AdminSchema);
module.exports = Admin;