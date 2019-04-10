const express = require("express");
const https = require("https");
const fs = require("fs");
const flash = require("connect-flash");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const url = require("url");
const passport = require("passport");
require("dotenv").config();

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
//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");
//BODYPARSER
app.use(express.urlencoded({ extended: false }));
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

//ROUTES
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
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
