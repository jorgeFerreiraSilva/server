const express = require('express');

const router = express.Router();
const CommentModel = require('../model/Comment');

router.post('/ads/:adId/users/:ownerId', (req, res) => {

  const { text } = req.body;

  const errors = {};

  if (!req.params.adId) {
    errors.adId = 'Obrigatório que o comentário possua o id do anúncio';
  }

  if (!req.params.ownerId) {
    errors.ownerId = 'Obrigatório que o comentário possua o id do dono';
  }

  if (text.length < 6 || text.length > 280) {
    errors.text = 'O comentário deve ter entre 6 caracteres e 280 caracteres';
  }

  if (Object.keys(errors).length !== 0) {
    res.status(422).json(errors);
    return;
  }

  const newComment = new CommentModel({ adId: req.params.adId, ownerId: req.params.ownerId, text });

  newComment.save()
    .then((comment) => {
      res.status(201).json(comment);
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json(err);
    });
});

// Search comments by Ad
router.get('/ads/:adId', (req, res) => {
  CommentModel.find({ adId: req.params.adId })
    .then((comment) => {
      if (comment.length) {
        res.status(200).json(comment);
      } else {
        res.status(404).json({ message: 'Este anúncio não possui comentários.' });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json({ message: 'Insira um id de comentário válido.' });
    });
});

// Delete ad by id
router.delete('/:id', (req, res) => {
  CommentModel.remove({ _id: req.params.id })
    .then(() => {
      res.status(204).json();
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json({ message: 'Insira um id de comentário válido.' });
    });
});

module.exports = router;
