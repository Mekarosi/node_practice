const express = require("express");
const app = express();
const mongo= require("mongoose");
const cors = require("cors");
const PORT = 8080;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Joi = require('@hapi/joi');





const scheme = Joi.object().keys({
  username: Joi.string().required().min(3).max(20),
  password: Joi.string().required().min(6).max(13).alphanum(),
  email: Joi.string().email().required(),
  fullname: Joi.string().required().min(3).max(20)
})

app.use(cors());
app.use(express.json());
//mongo.connect("mongodb://127.0.0.1:27017/nesa", err => {
  mongo.connect("mongodb+srv://mekarosi:assa@cluster0-jiqvx.mongodb.net/test?retryWrites=true&w=majority", err => {
if (err) {
 console.log("BROKEN");

} else {
 console.log("CONNECTED");
}
});

const blog = require('./models/blog')
const user = require('./models/users')
const blogPost = require('./models/blogpost')


app.post('/publishpost', (req,res)=>{
  const blogDetails = req.body
  const publishpost = new blogPost(
    {
      authorName: blogDetails.authorName,
      publicationTitle: blogDetails.publicationTitle,
      body: blogDetails.body
    }
  )
  publishpost.save((err,doc)=>{
    if(err) console.log(err)
    return res.json(doc)
  })
})



app.get('/savedata',(req,res)=>{
    const data = req.query
    const blogPost = new blog(
        {
        title: data.title,
        author: data.author,
        body: data.body,
        comments: 0,
        date: new Date()
       }
       )
    
    blogPost.save((err,doc)=>{
        return res.json(doc)

    })
})


app.get('/getblogs',(req,res)=>{
  blogPost.find({},(err,arr)=>{
      if(err) console.log(err)
      return res.json(arr)
  });
});



app.post("/login", (req, res) => {
const userDetails = req.body;
const password = userDetails.password
user.findOne({email:userDetails.email}, (err, doc) => {
 if (err) {
   return res.send("I got an error");
 } 
 

   if (doc) {

    if(bcrypt.compareSync(password, doc.password)){
      return res.json({
        status:true,
        userDetail:doc
      })
    }

    
    
     return res.json({
       status: false,
       message: 'Wrong password'
     });
    
  
   } 
     // return res.send("No User Matching Details");
     return res.json({
       status: false,
       message: 'No User Matching Details'
     });
   
 
});
});



app.post("/signup", (req, res) => {
  const userDetails = req.body;
  const result = Joi.validate(userDetails,scheme)
  
  const error = result.error
  const value = result.value

  var userSchema = new mongo.Schema({
    email: { type: String, required: true, unique: true},
});


  if(error){
    return res.json(error)
  }
  
  const password = userDetails.password
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  
  userDetails.password = hash
  
  const newUser = new user(userDetails);
  
  newUser.save((err, doc) => {
    if (err) {
     console.log(err);
     return res.send("I got an error");

    } 
    //prevent Duplicating email address
     if(userDetails.email === doc.email){
       return res.send('email taken')
     }
    

   else {
     return res.json(doc);
      
   }
  });


});
  


app.listen(PORT, err => {
if (err) {
 console.log(err);
} else {
 console.log("And We are live!!!!!!");
}
});
