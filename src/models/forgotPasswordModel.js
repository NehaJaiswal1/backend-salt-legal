

const mongoose = require("mongoose");

const forgotPasswordSchema = new mongoose.Schema({
  email:{
    type:String,
    // required:true,
    trim:true
  },
  resetToken :{
    type: String,
    // required:true,
    trim: true
  },
  resetTokenExpires : {
    type : String,
    // required: true,
    trim : true
  },
      deletedAt: {
        type: Date
    },

    isDeleted: {
        type: Boolean,
        default: false
    },
},{timeStamps : true})

module.exports = mongoose.model("forgotPassword", forgotPasswordSchema);