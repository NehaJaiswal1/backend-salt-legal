


// subCategory.js
const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    subCategory: {
      type: String,
      required: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
  },
    isDeleted: {
      type: Boolean,
      default: false
    }
  }, { timestamps: true });

module.exports = mongoose.model("SubCategory", subCategorySchema);
