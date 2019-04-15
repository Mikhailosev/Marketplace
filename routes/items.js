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

const { ensureAuthenticated } = require("../config/auth");
router.get("/items", ensureAuthenticated, (req, res) => {
  res.render("items", {
    user: req.user.name
  });
});

router.post(
  "/",
  upload.single("itemImage"),
  ensureAuthenticated,
  (req, res) => {
    const item = new Item({
      name: req.body.name,
      size: req.body.size,
      quality: req.body.quality,
      price: req.body.price,
      description: req.body.description,
      itemImage: req.file.path
    });
    item
      .save()
      .then(result => {
        console.log(result);
        /*res.status(201).json({
          message: "Created product successfully",
          _id:result.id,
          name: req.body.name,
          size: req.body.size,
          quality: req.body.quality,
          price: req.body.price,
          description: req.body.description,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + result.id
            }
          }
        );*/
        res.redirect("/dashboard/shop");
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }
);
router.get("/shop/:itemId", (req, res, next) => {
  const id = req.params.itemId;
  Item.findById(id)
    .select("name size quality description price itemImage")
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

router.get("/shop", ensureAuthenticated, (req, res) => {
  Item.find()
    .select("name size quality description price itemImage")
    .then(docs => {
      const response = {
        count: docs.length,
        items: docs.map(doc => {
          return {
            _id: doc.id,
            name: doc.name,
            size: doc.size,
            quality: doc.quality,
            price: doc.price,
            description: doc.description,
            itemImage: doc.itemImage,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc.id
            }
          };
        })
      };
      //if(docs.length>=0){

      res.render("shop", {
        items: docs.map(doc => {
          return {
            _id: doc.id,
            name: doc.name,
            size: doc.size,
            quality: doc.quality,
            price: doc.price,
            description: doc.description,
            itemImage: doc.itemImage,}}),
        user: req.body.user
      });
      //}else{
      //  res.status(404).json({
      //      message:'No entries found'
      // });
      //}
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});
router.patch("/shop/:itemId", (req, res, next) => {
  const id = req.params.itemId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Item.update({ _id: id }, { $set: { updateOps } });
});
router.delete("/shop/:itemId", (req, res, next) => {
  const id = req.params.itemId;
  Item.remove({
    _id: id
  }) /*.then(res=>{
    res.status(200).json(result)
  }).catch(err=>{
    console.log(err)
    res.status(500).json({

    })*/;
});
module.exports = router;
