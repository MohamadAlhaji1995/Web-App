
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role:{
    type:String,
    enum: ['user', 'admin'],
    default:'user',
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'mindestens 6 Zeichen'],
  },

}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
