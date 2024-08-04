const path = require('path') 
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const studentRouter = require('./routes/info')
const cors = require('cors')
const ejs = require('ejs')
const dotenv = require('dotenv')
dotenv.config({path : './config.env'})

app.use(cors())
app.set('view engine', 'ejs');
app.set('views' , 'views')
app.use(express.static(path.join(__dirname , 'public')));
app.use(express.json())

app.use('/' , studentRouter)


// mongoose.connect(process.env.URI).then(
// }))
// .catch(err=>{console.log(err)})

app.listen(process.env.PORT , ()=>{
    console.log("server started")
})
