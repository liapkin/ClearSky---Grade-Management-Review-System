const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  gradeId: { type: String, required: true, unique: true },
  institutionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution', required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
