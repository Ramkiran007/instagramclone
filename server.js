const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const bodyParser = require("body-parser");
const {MONGOURI} = require("./config/keys")

// database connection
mongoose.connect(MONGOURI, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify:false, useUnifiedTopology: true })
.then(()=>console.log('Your database is connected'))
.catch(()=>console.log('Try to connect again'));




//model middlewares
require('./models/users')
require('./models/post')


//init middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())





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


//connect server
app.listen(PORT,()=>{console.log("Your server got connected")});
