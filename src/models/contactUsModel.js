

const mongoose = require('mongoose');

const contactUs = new mongoose.Schema({
name:{
    type:String,
    required:true
    },
  email:{
    type:String,
    required:true
  },
  phone:{
    type:String,
    required:true
  },
  message: {
    type:String,
    required:true
  },  
  queryDate: {
    type:String,
    required:true
  },  
  queryTime: {
    type:String,
    required:true
  },  
  isDeleted:{
    type:Boolean,
    default:false
  },
},{timestamps:true});

module.exports  = mongoose.model('contactUs', contactUs);