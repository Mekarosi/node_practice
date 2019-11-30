const express = require('express');
const app = express();
const mongo = require('mongoose');
const cors = require('cors');
const PORT = 8080;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const config = require('./node_modules/config');
const connectDb = require('./config/db');
const blog = require('./models/Blog');
const user = require('./models/Users');
const blogPost = require('./models/Blogpost');

app.use(cors());
app.use(express.json());
connectDb();

const connectionObjection = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'assa'
};

const connection = mysql.createConnection(connectionObjection);
connection.connect(err => {
  if (err) {
    console.log('error');
  } else {
    console.log('mysql DB connected');
  }
});

const scheme = Joi.object().keys({
  username: Joi.string()
    .required()
    .min(3)
    .max(20),
  password: Joi.string()
    .required()
    .min(6)
    .max(13)
    .alphanum(),
  email: Joi.string()
    .email()
    .required(),
  fullname: Joi.string()
    .required()
    .min(3)
    .max(20)
});

app.get('/jobs', (req, res) => {
  connection.query('SELECT * FROM `feedback`', (err, results, fields) => {
    if (!err) {
      return res.json({
        status: true,
        result: results
      });
    }

    console.log(err);
    return res.json({
      status: false,
      message: 'there is error'
    });
  });
});

app.get('/job', (req, res) => {
  connection.query(
    'SELECT * from `application_master` as am INNER JOIN `feedback` AS fb ON fb.jobseekid = am.jobseekid INNER JOIN `jobseeker_education` AS js ON js.jobseekid= am.jobseekid WHERE am.jobseekid=3',
    (err, results, fields) => {
      if (!err) {
        return res.json({
          status: true,
          result: results
        });
      }

      console.log(err);
      return res.json({
        status: false,
        message: 'not responsing'
      });
    }
  );
});

app.post('/publishpost', (req, res) => {
  const blogDetails = req.body;
  const publishpost = new blog({
    authorName: blogDetails.authorName,
    publicationTitle: blogDetails.publicationTitle,
    body: blogDetails.body
  });
  publishpost.save((err, doc) => {
    if (err) console.log(err);
    return res.json(doc);
  });
});

app.get('/savedata', (req, res) => {
  const data = req.query;
  const blogPost = new blog({
    publicationTitle: data.publicationTitle,
    authorName: data.authorName,
    body: data.body,
    date: new Date()
  });

  blogPost.save((err, doc) => {
    return res.json(doc);
  });
});

app.post('/getposts', (req, res) => {
  blog.find({}, (err, doc) => {
    if (err) {
      console.log(err);
    } else {
      return res.json({ posts: doc });
    }
  });
});

app.post('/login', (req, res) => {
  console.log(req.body);
  const userDetails = req.body;
  const password = userDetails.password;
  user.findOne({ email: userDetails.email }, (err, doc) => {
    if (err) console.log(err);
    if (doc)
      return res.json({
        userDetails: doc,
        status: true
      });
    return res.send('no user found');
  });
});

app.post('/signup', (req, res) => {
  console.log(req.body);
  const userDetails = req.body;
  const result = Joi.validate(userDetails, scheme);

  const error = result.error;
  const value = result.value;

  var userSchema = new mongo.Schema({
    email: { type: String, required: true, unique: true }
  });

  if (error) {
    return res.json(error);
  }

  const password = userDetails.password;

  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);

  userDetails.password = hash;

  const newUser = new user(userDetails);

  newUser.save((err, doc) => {
    if (err) {
      console.log(err);
      return res.send('I got an error');
    } else {
      const token = jwt.sign(doc.toJSON(), 'parish', {
        expiresIn: '300d'
      });
      return res.json({
        status: true,
        userDetails: token
      });
    }
  });
});

app.listen(PORT, err => {
  if (err) {
    console.log(err);
  } else {
    console.log('And We are live!!!!!!');
  }
});
