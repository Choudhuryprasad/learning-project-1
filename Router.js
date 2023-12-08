const express = require('express');
const fs = require('fs');
const {Reg,log,fg,st} = require("./controller/appController");
const multer = require('multer');

const router = express.Router();

var fileStream

try {
      fileStream = fs.readFileSync('C:\\Users\\khadi\\OneDrive\\Desktop\\learning project-2\\public\\index.html', 'utf-8');
} catch (error) {
     console.log(error)
}

//Routers
router.get('/',(req,res)=>{
     res.send(fileStream)
})



const uploadFolder = 'public/uploads';
if (!fs.existsSync(uploadFolder)) {
     fs.mkdirSync(uploadFolder, { recursive: true });
}

const strg = multer.diskStorage({
     destination: (req, file, cb) => {
          // Specify the destination folder for storing uploaded files
          cb(null, 'public/uploads/');
     },
     filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
     },
});

const uploads = multer({ storage: strg });



router.post('/senddata',uploads.single('image'),Reg);
router.post('/sendinfo', log);
router.post('/sendemail',fg);
router.post('/sendotp',st)



module.exports = router;


