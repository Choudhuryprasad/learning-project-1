const nodemailer = require('nodemailer');
const mailgen = require('mailgen');
const multer = require('multer');
const mongoose = require('mongoose');
const fs = require('fs');
const bcrypt = require('bcrypt');
const saltRounds = 10;
let highimg;

let value;

//Creating Schema for Register
const registerschema = new mongoose.Schema({
     username: {
          type: String,
          required: [true, 'User name must be required.']
     },
     email: {
          type: String,
          required: [true, 'Email must be required.']
     },
     password: {
          type: String,
          required: [true, 'Password must be required']
     },
     image: {
          data: Buffer,
          contenType: String
     }
})

//creating model
const register = mongoose.model('regiter', registerschema)


const log = async (req, res) => {
     let username = req.body.username;
     let password = req.body.password;

     console.log(username)
     console.log(password)

     const user = await register.findOne({ username: username });

     if (user) {
          // Comparing the entered password with the store hash password
          const passwordMatch = await bcrypt.compare(password, user.password);


          console.log(user.password)

          if (passwordMatch) {
               res.status(200).json({ message: 'Login successful' });
               console.log("Login successful");

          } else {
               res.status(401).json({ message: 'Invalid password' });

          }
     } else {
          res.status(404).json({ message: 'User not found' });
     }

}


const fg = async (req, res) => {
     let femail = req.body.email
     console.log(femail)

     let num = Math.random();
     num = num * 10000;
     num = Math.floor(num);
     value = num;


     let config = {
          service: 'gmail',
          auth: {
               user: process.env.EMAIL,
               pass: process.env.EMAILPASS
          }
     }

     let transpoter = nodemailer.createTransport(config)

     let MG = new mailgen({
          theme: 'default',
          product: {
               name: 'mailgen',
               link: 'http://mailgen.js/'
          }
     });


     let response = {
          body: {
               name: "KTD",
               intro: "Your OTP has arrived!",
               table: {
                    data: [{
                         OTP: `${num}`,
                         decription: "A KTD OTP",
                    }]
               }
          },
          outro: "looking forword for more order from you"
     }

     let mail = MG.generate(response)

     const message = {
          from: process.env.EMAIL, // sender address
          to: femail, // list of receivers
          subject: "FOR KTD VERIFICATION MAIL", // Subject line
          text: "Hello user have a good day", // plain text body
          html: mail, // html body
     }

     transpoter.sendMail(message).then((result) => {
          console.log(result)
     }).catch((err) => {
          console.log(err)
     })


}

const st = (req, res) => {
     let otp = req.body.otp * 1
     console.log(otp)
     console.log(value)
     if (otp == value) {
          console.log('OTP verification successfull')
          res.status(200)
     }
     else {
          console.log('OTP verification invalid')
     }
}

const Reg = (req, res) => {
     let username = req.body.username;
     let email = req.body.email;
     let password = req.body.password;
     let uploadedFile = req.file;

     const hash = bcrypt.hashSync(password, saltRounds);


     if (!uploadedFile) {
          console.log("Image is not found");
          // return res.status(400).send("Image is not found");
     }

     try {
          let imagedata = fs.readFileSync(uploadedFile.path);
          highimg = imagedata;


          const testregister = new register({
               username: username,
               email: email,
               password: hash,
               image: {
                    data: imagedata,
                    contentType: uploadedFile.mimetype // Use the mimetype from Multer
               }
          });

          testregister.save().then(doc => {
               console.log(doc);
               res.status(200).send("Registration successful");
          }).catch((err) => {
               console.log(err);
               res.status(500).send("Internal Server Error");
          });

          const insertedId = testregister._id; // Access the inserted ID from the saved document

          const retrievedImage = register.findOne({ _id: insertedId });
          const imgData = retrievedImage.image.data.toString('base64');

          res.status(200).json({
               message: 'Registration successful',
               imgData: retrievedImage.image.data.toString('base64')
          });

     }    catch (error) {
          console.log(error);
          // res.status(500).send("Internal Server Error");
     } finally {
          console.log("Finally block is executed");
     }
}

module.exports = {
     Reg,
     log,
     fg,
     st
}