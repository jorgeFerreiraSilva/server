const mongoose = require('mongoose');

const { Schema } = mongoose;

const reservationSchema = new Schema({
  adId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ad', required: true },
  hirerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pathPictures: { type: Array },
  title: { type: String, required: true },
  pricePerDay: { type: Number, min: 1 },
  totalPrice: { type: Number, min: 1 },
  startDate: { type: String },
  endDate: { type: String },
  status: { type: String, required: true, default: 'Em espera', enum: ['Em espera', 'Alugando', 'Finalizado', 'Recusado'] }
});

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;
