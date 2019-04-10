const express = require("express");
//PROTECTION FOR ROUTES
const { ensureAuthenticated } = require("../config/auth");
const router = express.Router();
//welcome page
router.get("/", (req, res) => {
  res.render("welcome");
});
//dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.user.name
  });
});

module.exports = router;
