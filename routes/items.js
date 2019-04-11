const express = require("express");
const router = express.Router();
const imgtrans = require('../img')
const mongoose = require('mongoose')
const multer=require('multer')({limits: { fileSize:1000*1024 }})
const uuid = require('uuid/v4')

const Item = require("../models/Item");
const { ensureAuthenticated } = require("../config/auth");
router.get("/items", ensureAuthenticated, (req, res) => {
    res.render("items", {
      user: req.user.name
    });
  });
  router.get("/shop", ensureAuthenticated, (req, res) => {
    res.render("shop", {
      user: req.user.name
    });
  });
  router.post('/', multer.single('image'), (req, res) => {
    
        insertRecord(req, res)
    
})
module.exports = router;
insertRecord=(req,res)=>{
    let id = uuid()
    console.log('upload', req.body)
    imgtrans.small(req.file.buffer).save(id)
    let item = new Item()
    item.name = req.body.name;
    item.size = req.body.size;
    item.price = req.body.price;
    item.quality = req.body.quality;  
    item.descrption = req.body.descrption
    item.img = id;
    item.save((err, doc) => {
        if (!err)
            res.render(path);('dashboard/shop')
        
    })
}
updateRecord=(req, res)=> {
  Item.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
     
      
  })
}
router.get('/shop', (req, res) => {
  Item.find((err, docs) => {
      if (!err) {
          res.render("dashboard/shop", {
              Item: docs
          })
      }
  })})
  module.exports=router