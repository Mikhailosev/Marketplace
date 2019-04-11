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
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  img: 
      { type: String }
});

const Item = mongoose.model("Item", ItemSchema);

module.exports = Item;
