//import { mongoose } from "mongoose";
const mongoose = require('mongoose')
const User = mongoose.model('User', {
    email: String,
    name: String,
    password: String,
    type: String
})

module.exports = User