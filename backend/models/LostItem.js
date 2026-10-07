const mongoose = require("mongoose");

const lostItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ["Lost", "Found"]
  }
});

module.exports = mongoose.model("LostItem", lostItemSchema);
