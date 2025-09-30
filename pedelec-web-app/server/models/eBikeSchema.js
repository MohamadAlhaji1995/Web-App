const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//const { Schema } = mongoose;

const eBikeSchema = new mongoose.Schema({
 
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true
},

  brand: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  rent: {
    type: Number,
    required: true
},

  status: {
    type: String,
    enum: ['verfügbar', 'ausgeliehen', 'verkauft'],
    default: 'verfügbar'
  },
  
  bookingsHours: {
    type: Number,
    default: 0
    
},
imageUrl:{
  type:String,
  default:''
},
rentedFrom: {
  type: Date,
  default: null,
},
rentedTo: {
  type: Date,
  default: null,
}
  
},{timestamps:true});



const EBike = mongoose.model("EBike", eBikeSchema);

module.exports = EBike;
