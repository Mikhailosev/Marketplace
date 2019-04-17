const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter
});

const Item = require("../models/Item");
const User=require('../models/User')

const { ensureAuthenticated } = require("../config/auth");

router.get("/items", ensureAuthenticated, (req, res) => {
  res.render("items", {
    user: req.user.name
  });
});
router.get('/search', (req, res) => {
  Item.find({name: { $regex: req.query.searchField } }).then(result => {
  res.json(result);
console.log(result)
});
});

router.post(
  "/shopItemAdd",
  upload.single("itemImage"),
  ensureAuthenticated,
  (req, res) => {
    const item = new Item({
      name: req.body.name,
      size: req.body.size,
      quality: req.body.quality,
      price: req.body.price,
      description: req.body.description,
      itemImage: req.file.path,
      userId: req.user._id
    });
    item
      .save()
      .then(result => {
        console.log(result);
        res.json(result);

      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
   res.redirect('/dashboard/shop');}
);
router.get("/shopItem/:itemId", (req, res, next) => {
  const id = req.params.itemId;
  Item.findById(id)
    .select("name size quality description price itemImage userId")
    .then(doc => {
      if (doc) {
        res.status(201).json({
          message: "HAndling post request for items",
          createdProduct: doc
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for the product" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


router.get("/shopItems", (req, res) => {
  Item.find()
    .select("name size quality description price itemImage")
    .then(docs => {
      res.send(docs)
      //if(docs.length>=0){ 
      });
      //}else{
      //  res.status(404).json({
      //      message:'No entries found'
      // });
      //}
});
router.get('/passuser', ensureAuthenticated, (req,res,next)=>{
  const userId=req.user._id
  User.find({
    _id: userId
  })
  .then(docs => {
    res.send(docs)
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
})
router.get("/shopItemsCreatedByUser",ensureAuthenticated, (req, res) => {
  const userId = req.user._id;
  Item.find({
    userId: userId
  })
  
    .select("name size quality description price itemImage")
    .then(docs => {
      res.send(docs)
      //if(docs.length>=0){ 
      });
      //}else{
      //  res.status(404).json({
      //      message:'No entries found'
      // });
      //}
});
router.patch("/shopItem/:itemId", (req, res, next) => {
  const id = req.params.itemId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Item.update({ _id: id }, { $set: { updateOps } });
});
//delete
router.delete("/delete/:itemId", (req, res, next) => {
  const id = req.params.itemId;
  Item.findOneAndRemove({
    _id: id
  }) /*.then(res=>{
    res.status(200).json(result)
  }).catch(err=>{
    console.log(err)
    res.status(500).json({

    })*/;
});
router.get('/shop', (req, res) => {
res.render('shop');
});
module.exports = router;
