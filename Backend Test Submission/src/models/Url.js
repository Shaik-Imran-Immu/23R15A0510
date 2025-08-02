const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
  timestamp: Date,
  referrer: String,
  location: String
});

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortcode: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiry: { type: Date, required: true },
  clickCount: { type: Number, default: 0 },
  clicks: [clickSchema]
});

urlSchema.index({ expiry: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Url', urlSchema);