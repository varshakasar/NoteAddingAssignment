const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const router = express.Router();

let userSchema = require('../models/userSchema.js');
let noteSchema = require('../models/noteSchema.js');

let User = mongoose.model('user', userSchema);
let Note = mongoose.model('note',noteSchema);



router.post('/registerUser',(req,res,next) => {

  //console.log('Inside register user');
  let email = req.body.email;
  let name = req.body.name;
  let age = req.body.age;
  let gender = req.body.gender;
  let password = req.body.password;
  if ((typeof name == undefined) || name == "") {
      res.json({
        success: false,
        message: "Name not defined."
      })
    } else if ((typeof email == undefined) || email == "") {
      res.json({
        success: false,
        message: "Email not defined."
      })
    } else if ((typeof age == undefined) || age == "") {
      res.json({
        success: false,
        message: "age not defined."
      })
    }else if ((typeof gender == undefined) || gender == "") {
      res.json({
        success: false,
        message: "gender not defined."
      })
    } else {
      User.findOne({
        email:email
      }).exec((err,result) =>{
        if(result){
          res.json({
            success:false,
            message:'Email already exist..'
          })
        } else{
          let user = new User({
            email:email,
            name:name,
            age:age,
            gender:gender,
            password:password,
            isauthenticated: false
          });
          user.save((err,result) => {
            if (err) {
              next(err);
            } else{
              let transporter = nodemailer.createTransport({
                  host: 'req.host',
                  service: 'gmail',
                  auth: {
                      user: 'varshagk1994@gmail.com',
                      pass: '8412032207'
                  }
              });
              let link = "http://" + req.get('host') + "/verify?email=" + email;
              let mailOptions = {
                  from: 'varshagk1994@gmail.com',
                  to: 'varshagk1994@gmail.com',
                  subject: 'Confirm your mail account',
                  html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
              };
              transporter.sendMail(mailOptions,(err,result) => {
                if(err){
                  next(err);
                }else{
                  res.json({
                success: true,
                message: "User confirmation email sent successfully..",
                data:result
              });
                }
              })

            }
          })
        }
      })
    }
})
router.get('/verify', (req,res,next) => {
  User.findOneAndUpdate({
          email: req.query.email
        }, {
          $set: {
            isauthenticated: true
          }
        },
        (err,result) => {
          if(err){
            next(err);
          }
          else{
            res.json({
            success:true,
            message:'User confirm successfully..',
            data:result
          })
          }
        });
})

router.post('/login',(req,res,next) => {

  if ((typeof req.body.email == undefined) || req.body.email == "") {
    return res.json({
      success: false,
      message: ' Email Not Defined..'
    })
  }
  if ((typeof req.body.pass == undefined) || req.body.pass == "") {
    return res.json({
      success: false,
      message: ' Password Not Defined..'
    })
  }
  let email = req.body.email;
  let pass = req.body.pass;
   User.findOne({
    email:email
    }).exec((err, result) => {
    if (result) {

      if(result.isauthenticated == true && result.password == req.body.pass){
        req.session.email = req.body.email;
        req.session.pass = req.body.pass;
        res.json({
        success: true,
        message: 'Valid User and login successfully'
      })
      }
      else{
        res.json({
        success: false,
        message: 'Incorrect password'
      })
      }

    } else {
      res.json({
        success: false,
        message: 'Invalid User'
      })
    }
  })
})

router.get('/note', isVerified ,(req, res, next) => {
  Note.find({}).exec((err, result) => {
    if (err) {
      next(err);
    } else {
      res.json({
        success: true,
        data: result
      })
    }
  })
})
router.post('/note',isVerified ,(req,res,next) => {
  let subject = req.body.subject;
  let content = req.body.content;
  let tag = req.body.tag;
  let note = new Note({
    subject:subject,
    content:content,
    tag:tag
  });
  note.save((err,result) => {
    if(err){
      next(err);
    } else{
      res.json({
        success:true,
        message:'note created..',
        data:result
      })
    }
  })
})

router.put('/note/:id', isVerified ,function(req, res,next) {

  var id = req.params.id;
  var subject = req.body.subject;
  var content = req.body.content;
  var tag = req.body.tag;
  var obj = {
    subject: subject,
    content:content,
    tag:tag
  };
  var query = {
    $set: obj
  };
  Note.findOneAndUpdate({
      _id: id
    },
    query,
    function(err, result) {
      if (err) {
        next(err);
      } else {
        res.json({
          success:true,
          message:'note updated..',
          data:result
        })
      }
    });
})
router.delete('/note/:id', isVerified ,function(req, res, next) {

  var id = req.params.id;
  Note.findOneAndDelete({
      _id: id
    },
    function(err, result) {
      if (err) {
        next(err);
      } else {
        res.json({
          success:true,
          message:'note deleted..',
          data: result
        })
      }
    })
})

function isVerified(req, res, next) {
  // check user is authenticated or not
  if (req.session.email && req.session.pass) {
    next();
  } else {
    res.send('You are not logged in First Login..')
  }
}
router.get('/isUserAuthenticated', (req, res) => {
  if (req.session.email && req.session.pass) {
    res.send("User is authenticated with email : " + req.session.email);
    res.end();
  } else {
    res.send('Please,Login first');
    res.end();
  }
});
router.get('/logout', (req, res, next) => {
  req.session.destroy(function(err) {
    if (err) {
      next(err);
    } else {
      res.send("logout!!!");
    }
  });
});
module.exports = router;