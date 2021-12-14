const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const cors=require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const PORT = process.env.PORT || 4000;
const path = require('path');
// const movieRoute = require('./routes/movieRoute');
const userRoute = require('./routes/userRoute');

dotenv.config();
app.use(cors());
mongoose.connect('mongodb://localhost:27017/fym');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connection Successful!");
});
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use('/account',userRoute);

app.listen(PORT,function(){
    console.log('Server is running on Port: ' +PORT);
});


