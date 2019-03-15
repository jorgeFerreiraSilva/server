const mongoose = require('mongoose');

const { DB_NAME, DB_HOST, DB_PORT } = process.env;

module.exports = () => {
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
    .then(() => {
      console.log('Connected to mongoDB');
    })
    .catch((err) => {
      throw new Error(err);
    });
};
