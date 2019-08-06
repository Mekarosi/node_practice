const mongoose = require('mongoose');
const config = require('config');
// const bodyParser = require('../node_modules/body-parser')


const db = config.get('mongoURI')

const connectDb = async () => {
   try {
       await mongoose.connect(db,{
           useNewUrlParser: true
       });
       console.log('mongodb connected....')
   } catch (err) {
       console.error(err.message)
       //exit process with failure
       process.exit(1);
   }
}
module.exports = connectDb;
