const express = require("express");
//USER MODEL
const User = require("../models/User");
//CRYPT
const bcrypt = require("bcryptjs");
//PASSPORT
const passport = require("passport");
const router = express.Router();
//LOGIN PAGE
router.get("/login", (req, res) => {
  res.render("login");
});
//REGISTER PAGE
router.get("/register", (req, res) => {
  res.render("register");
});
//POSTING TO DB
router.post("/register", (req, res) => {
  const { name, username, email, password, password2 } = req.body;
  let errors = [];
  //CHECK REQUIRED FIELDS
  if (!name) {
    errors.push({ msg: "Please fill in Name" });
  }
  if (!username) {
    errors.push({ msg: "Please fill in Username" });
  }
  if (!email) {
    errors.push({ msg: "Please fill in Email" });
  }
  if (!password) {
    errors.push({ msg: "Please fill in Password" });
  }
  if (!password2) {
    errors.push({ msg: "Please fill in Password Confirmation" });
  }
  //CHECK PASSWORD MATCH
  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }
  //CHECK PASSWORD LENGTH
  if (password.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters" });
  }
  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      username,
      email,
      password,
      password2
    });
  } else {
    //VALIDATION PASSED
    User.findOne({ email: email })
      //returns  promise
      .then(user => {
        if (user) {
          //USER EXISTS
          errors.push({ msg: "Email is already registered" });
          res.render("register", {
            errors,
            name,
            username,
            email,
            password,
            password2
          });
        } else {
          const newUser = new User({
            name,
            username,
            email,
            password
          });
          //HASH PASSWORD with bcrypt
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              //SET PASSWORD TO HASHED
              newUser.password = hash;
              //SAVE USER
              newUser
                .save()
                .then(user => {
                  req.flash(
                    "success_msg",
                    "You are now registered and can log in"
                  );
                  res.redirect("/users/login");
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
  }
});

//LOGIN HANDLE
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "login",
    failureFlash: true
  })(req, res, next);
});
//LOGOUT HANDLE
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/");
});

module.exports = router;
