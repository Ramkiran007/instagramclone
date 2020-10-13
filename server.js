const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const bodyParser = require("body-parser");
const {MONGOURI} = require("./config/keys")
var timeout = require('connect-timeout')

// database connection
mongoose.connect(MONGOURI, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify:false, useUnifiedTopology: true })
.then(()=>console.log('Your database is connected'))
.catch(()=>console.log('ERROR-Try to connect again'));




//model middlewares
require('./models/users')
require('./models/post')


//init middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())

app.post('/save', timeout('5s'), bodyParser.json(), haltOnTimedout, function (req, res, next) {
    savePost(req.body, function (err, id) {
      if (err) return next(err)
      if (req.timedout) return
      res.send('saved as id ' + id)
    })
  })



//routes middlewares
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

// middleware for connecting and combining different host
app.use(cors())


if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

function haltOnTimedout (req, res, next) {
    if (!req.timedout) next()
  }
  
  function savePost (post, cb) {
    setTimeout(function () {
      cb(null, ((Math.random() * 40000) >>> 0))
    }, (Math.random() * 7000) >>> 0)
  }

//connect server
app.listen(PORT,()=>{console.log("Your server got connected")});
