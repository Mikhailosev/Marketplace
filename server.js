const express = require("express");
const https = require("https");
const fs = require("fs");
require("./models/Item");
const flash = require("connect-flash");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const url = require("url");
const bodyParser=require('body-parser')
const passport = require("passport");
require("dotenv").config();
const morgan=require('morgan')
//PATH TO ITEM CONTROLLER
const itemController = require("./routes/items")
const render = require("./routes/render")

const sslkey = fs.readFileSync("certificate/ssl-key.pem");
const sslcert = fs.readFileSync("certificate/ssl-cert.pem");
//PASSPORT CONFIG
require("./config/passport")(passport);
let app = express();

//DB CONFIG
const db = require("./config/keys").MongoURI;
//Connect to Mongo
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));
  //Image upload
  app.use('/dashboard/uploads',express.static('uploads'))
//EJS
app.use(expressLayouts)
app.set("view engine", "ejs");
//BODYPARSER
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use((req,res,next)=>{
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Controll-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  if (req.method==='OPTIONS'){
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
  return res.status(200).json({

  })
  }
  next()
})

//EXPRESS SESSION MDLWR
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);
//PASSPORT MIDELLEWARE
app.use(passport.initialize());
app.use(passport.session());

//CONNECT FLASH
app.use(flash());
//GLOBAL VARS
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});
app.use(express.static(__dirname + "/public"));
//ROUTESassport.session(

app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use("/dashboard", itemController);
app.use("/dashboard", render);



const http = express();
const options = {
  key: sslkey,
  cert: sslcert
};

http.use((req, res, next) => {
  if (req.secure) {
    // request was via https, so do no special handling
    next();
  } else {
    // request was via http, so redirect to https
    res.redirect("https://localhost:3001/");
  }
});

http.listen(process.env.PORT);
console.log("got to http");
https.createServer(options, app).listen(process.env.PORTS);
console.log("redirected");
console.log(`server started on ${process.env.PORTS}`);
