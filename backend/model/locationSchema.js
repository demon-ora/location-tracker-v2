const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
 
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  route : {
    type : String,
    required : true,
  },
  routeName : {
    type : String,
    required : true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" 
},
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
