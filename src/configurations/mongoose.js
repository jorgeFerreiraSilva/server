const mongoose = require('mongoose');

const { DB_NAME, DB_HOST, DB_PORT } = process.env;

module.exports = () => {
  mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, { useNewUrlParser: true })
    .then(() => {
      console.log('Connected to mongoDB');
    })
    .catch((err) => {
      throw new Error(err);
    });
};
