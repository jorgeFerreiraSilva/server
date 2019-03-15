const express = require('express');

const router = express.Router();
const User = require('../model/User');

const uploader = require('../configurations/cloudinary');

router.get('/', (req, res) => {
  User.find({})
    .then((allUsers) => {
      res.status(200).json({ allUsers });
    })
    .catch((err) => {
      console.error(err);
      res.status(404).json({ message: 'Erro ao procurar usuários' });
    });
});


router.get('/:id', (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(404).json({ message: 'Usuário não encontrado' });
    });
});

router.delete('/', (req, res) => {
  User.deleteOne({ _id: req.user.id })
    .then((user) => {
      res.status(204).json({ user });
    })
    .catch((err) => {
      console.error(err);
      res.status(404).json({ message: 'Usuário não encontrado' });
    });
});

router.put('/:id', uploader.single('image'), (req, res) => {
  const { username, name, description, state } = req.body;

  if (req.file === undefined) {
    User.findOneAndUpdate({ _id: req.params.id }, { username, name, description, state })
      .then((user) => {
        res.status(200).json({ user });
      })
      .catch((err) => {
        console.error(err);
        res.status(404).json({ message: 'Usuário não encontrado' });
      });
  } else {
    User.findOneAndUpdate({ _id: req.params.id }, { username, name, description, state, pathPicture: req.file.url })
      .then((user) => {
        res.status(200).json({ user });
      })
      .catch((err) => {
        console.error(err);
        res.status(404).json({ message: 'Usuário não encontrado' });
      });
  }
});

module.exports = router;
