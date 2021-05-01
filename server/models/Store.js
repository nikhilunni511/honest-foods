const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema({
  loc: {
    type: String
  },
  location: {
    type: {
      type: String,
      enum: ['Polygon']
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    formattedAddress: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('Store', StoreSchema);
