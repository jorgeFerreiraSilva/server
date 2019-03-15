const mongoose = require('mongoose');

const { Schema } = mongoose;

const adSchema = new Schema({
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, minlength: 4 },
  description: { type: String, required: true },
  pricePerDay: { type: Number, min: 1 },
  pathPictures: { type: Array },
  category: { type: String },
  state: { type: String, required: true, enum: ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'] }
});

const Ad = mongoose.model('Ad', adSchema);
module.exports = Ad;
