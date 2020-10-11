const express = require('express');

const router = express.Router()
const mongoose = require('mongoose')
const User = require("../models/users")
const crypto = require('crypto')
const { runValidation, userSignupValidator, userSigninValidator } = require('../validators/auth');

const bcrypt = require("bcryptjs");
const {JWT_SECRET} =require( "../config/keys")
const jwt = require("jsonwebtoken");
const shortId = require('shortid');                                 //we need shortid because every collection should be unique thats y we have to create key for model.
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')



const transporter = nodemailer.createTransport(sendgridTransport({          //it is used to send email after user signup
    auth:{
        api_key:"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"
    }
}))


router.get('/', (req,res)=>{
    res.send("Hello Ramkiran");
});



router.post('/signup',userSignupValidator, runValidation, (req,res)=>{
    const {name,email,password,pic} = req.body 
    let username = shortId.generate()
   /* if(!email || !password || !name ){
       return res.status(422).json({error:"please add all the fields"})
    }
    */
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
          return res.status(422).json({error:"user already exists with that email"})
        }
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
              const user = new User({
                  username,
                  email,
                  password:hashedpassword,
                  name,
                  pic
              })
      
              user.save()
              .then(user=>{
                   transporter.sendMail({                      //here we are sending the email after successful signup
                       to:user.email,
                       from:"doxapi4966@zuperholo.com",
                       subject:"signup success",
                       html:"<h1>welcome to instagram</h1>"
                   })
                  res.json({message:"saved successfully"})
              })
              .catch(err=>{
                  console.log(err)
              })
        })
       
    })
    .catch(err=>{
      console.log(err)
    })
  })

  router.post('/signin',userSigninValidator,runValidation,(req,res)=>{
    const {email,password} = req.body
   /* if(!email || !password){
       return res.status(422).json({error:"please add email or password"})
    }
    */
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
           return res.status(422).json({error:"Invalid Email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                // res.json({message:"successfully signed in"})
               const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
               const {_id,name,email,followers,following,pic} = savedUser
               res.json({token,user:{_id, name, email} })
            }
            else{
                return res.status(422).json({error:"Invalid Email or password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})

router.post('/reset-password',(req,res)=>{                               // here we are using this reset the password
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"User dont exists with that email"})
            }
            user.resetToken = token
            user.expireToken = Date.now() + 3600000
            user.save().then((result)=>{
                transporter.sendMail({
                    to:user.email,
                    from:"doxapi4966@zuperholo.com",
                    subject:"password reset",
                    html:`
                    <p>You requested for password reset</p>
                    <h5>click in this <a href="http://localhost:3000/reset/${token}">link</a> to reset password</h5>
                    `
                })
                res.json({message:"check your email"})
            })

        })
    })
})


router.post('/new-password',(req,res)=>{
   const newPassword = req.body.password
   const sentToken = req.body.token
   User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
   .then(user=>{
       if(!user){
           return res.status(422).json({error:"Try again session expired"})
       }
       bcrypt.hash(newPassword,12).then(hashedpassword=>{
          user.password = hashedpassword
          user.resetToken = undefined
          user.expireToken = undefined
          user.save().then((saveduser)=>{
              res.json({message:"password updated success"})
          })
       })
   }).catch(err=>{
       console.log(err)
   })
})

  



module.exports = router;