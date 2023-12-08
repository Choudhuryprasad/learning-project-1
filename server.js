const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const app = express();

dotenv.config({ path: './config.env' });

//Middleware
app.use(bodyParser.json())
app.use('/', require('./Router.js'))
app.use(express.static('./public'))


// connecting to db
mongoose.connect(process.env.CONN_STR).then((conn) => {
     // console.log(conn)
     console.log("DB Connection Successful.")
}).catch((err) => {
     console.log("Some error has been occured.")
     console.log(err)
})


//creating server 
const port = process.env.port || 2002;

app.listen(port, () => {
     console.log(`server started on http://localhost:${port}`)
});