const mongoose = require('mongoose')
const schema = mongoose.Schema({
    title: String,
    author: String,
    body: String,
    comments: Number,
    date: Date
   })

module.exports = mongoose.model('blog',schema)
   
