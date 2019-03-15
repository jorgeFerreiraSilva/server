require('dotenv').config();

const express = require('express');
const morgan = require('morgan');

const session = require('express-session');
const passport = require('passport');
const cors = require('cors');

require('../configurations/passport');

// Configuration MongoDB.
const bodyParser = require('body-parser');
const connectionDb = require('../configurations/mongoose');

connectionDb();

// Middlewares imports.
const notFound = require('../middlewares/404.js');

// Port on Server configuration.
const HTTP_PORT = process.env.PORT;

// Server import.
const app = express();

// Configuration on Starter Server.
app.use(morgan('dev'));
app.use(bodyParser.json());

// Session Settings
app.use(session({
  secret: 'project aluguel mjm',
  resave: true,
  saveUninitialized: true
}));

// Starting Passport
app.use(passport.initialize());
app.use(passport.session());


//  Cors Settings
app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000', 'http://192.168.0.27:3000', 'http://192.168.0.39:3000']
}));

// Call Endpoints.
const authRoutes = require('../endpoints/auth-routes');
const userEndpoint = require('../endpoints/user');
const adRoutes = require('../endpoints/ad');
const commentRoutes = require('../endpoints/comment');
const reservationRoutes = require('../endpoints/reservation');
const messageRoutes = require('../endpoints/message');

app.use('/api/auth', authRoutes);
app.use('/api/users', userEndpoint);
app.use('/api/ads', adRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reservation', reservationRoutes);

app.get('*', (req, res) => notFound(req, res));

// Starting the Server.
app.listen(HTTP_PORT, () => {
  console.log(`My server is listening on port ${HTTP_PORT}!`);
});

module.exports = app;
