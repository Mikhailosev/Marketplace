const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  quality: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required:true
  },
  itemImage:{type:String, required:true},
  userId:{type:String, required:true}
});

const Item = mongoose.model("Item", ItemSchema);

module.exports = Item;
