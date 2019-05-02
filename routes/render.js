const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

router.get("/shop", (req, res) => {
    res.render("shop");
  });
  //get the link with item information to update
  
  router.get("/update/:itemId", ensureAuthenticated, (req, res) => {
    res.render("updateItem");
  });
  //get the link with item informatio
  
  router.get("/singleItem/:itemId", (req, res) => {
    res.render("singleItem");
  });

module.exports = router;
