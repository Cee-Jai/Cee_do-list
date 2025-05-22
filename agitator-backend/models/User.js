const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  points: { type: Number, default: 0 },
  unlockedThemes: [{ type: String, default: ['default'] }],
  unlockedMusic: [{ type: String, default: ['lofi'] }],
});

module.exports = mongoose.model('User', userSchema);
