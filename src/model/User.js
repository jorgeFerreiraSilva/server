const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, minlength: 6, unique: true },
  password: { type: String, minlength: 7, required: true },
  name: { type: String, min: 1, required: true },
  description: { type: String },
  pathPicture: { type: String, default: 'http://res.cloudinary.com/barbierimatheus/image/upload/c_limit,h_150,w_200/v1551565574/photos-application-aluguel/icon-user-fiesta.png' },
  state: { type: String, required: true, enum: ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'] }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
