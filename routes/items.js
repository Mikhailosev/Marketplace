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
  limits: { fileSize: 4000 * 4000 * 10 },
  fileFilter: fileFilter
});

const Item = require("../models/Item");
const User = require("../models/User");

const { ensureAuthenticated } = require("../config/auth");

router.get("/items", ensureAuthenticated, (req, res) => {
  res.render("items", {
    user: req.user.name
  });
});
router.get("/search", (req, res) => {
  Item.find({ name: { $regex: req.query.searchField } }).then(result => {
    res.json(result);
    console.log(result);
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
        res.send(result);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }
);
router.get("/shopItem/:itemId", (req, res, next) => {
  const id = req.params.itemId;
  Item.findById(id)
    .select("name size quality description price itemImage userId")
    .then(doc => 
      res.status(201).json(doc)
    );
});

router.get("/shopItems", (req, res) => {
  Item.find()
    .select("name size quality description price itemImage")
    .then(docs => {
      res.send(docs);
      //if(docs.length>=0){
    });
  //}else{
  //  res.status(404).json({
  //      message:'No entries found'
  // });
  //}
});
router.get("/passuser", ensureAuthenticated, (req, res, next) => {
  const userId = req.user._id;
  User.find({
    _id: userId
  })
    .then(docs => {
      res.send(docs);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});
router.get("/shopItemsCreatedByUser", ensureAuthenticated, (req, res) => {
  const userId = req.user._id;
  Item.find({
    userId: userId
  })

    .select("name size quality description price itemImage")
    .then(docs => {
      res.send(docs);
      //if(docs.length>=0){
    });
  //}else{
  //  res.status(404).json({
  //      message:'No entries found'
  // });
  //}
});
router.post(
  "/updatedItem/:itemId",
  ensureAuthenticated,
  upload.single("itemImage"),
  (req, res, next) => {
    const id = req.params.itemId;
    Item.findOneAndUpdate(
      { _id: id },
      {
        name: req.body.name,
        size: req.body.size,
        quality: req.body.quality,
        price: req.body.price,
        description: req.body.description,
        itemImage: req.file.path
      },
      { new: true },
      (error, item) => {
        if (error) {
          res.send(error);
        }
      }
    ).then(result => {
      res.send(result);
    })
  }
);
//delete
router.delete("/delete/:itemId", ensureAuthenticated, (req, res, next) => {
  const id = req.params.itemId;
  Item.deleteOne({
    _id: id
  }).then(docs => {
    res.send(docs);
    //if(docs.length>=0){
  });
});
//get the item information
router.get("/updateItem/:itemId", ensureAuthenticated, (req, res) => {
  const id = req.params.itemId;
  Item.findById(id)
    .select("name size quality description price itemImage userId")
    .then(doc => {
      res.send(doc);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});
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
