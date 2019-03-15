const express = require('express');

const router = express.Router();
const MessageModel = require('../model/Message');

router.post('/reservation/:reservationId/users/:ownerId/:hirerId', (req, res) => {

  const { text, sender } = req.body;
  const { reservationId, ownerId, hirerId } = req.params;

  const errors = {};

  if (!reservationId) {
    errors.reservationId = 'Obrigatório que a mensagem possua o id da reserva';
  }

  if (!ownerId) {
    errors.ownerId = 'Obrigatório que a mensagem possua o id do dono';
  }

  if (!hirerId) {
    errors.hirerId = 'Obrigatório que a mensagem possua o id do locatário';
  }

  if (text.length < 1) {
    errors.text = 'A mensagem deve ter no mínimo 1 caracter';
  }

  if (Object.keys(errors).length !== 0) {
    res.status(422).json(errors);
    return;
  }

  const newMessage = new MessageModel({ reservationId, ownerId, hirerId, text, sender });

  newMessage.save()
    .then((message) => {
      res.status(201).json(message);
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json(err);
    });
});

// Search messages by Reservation
router.get('/reservation/:reservationId', (req, res) => {
  MessageModel.find({ reservationId: req.params.reservationId })
    .then((message) => {
      if (message.length) {
        res.status(200).json(message);
      } else {
        res.status(404).json({ message: 'Esta reserva não possui mensagens.' });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json({ message: 'Insira um id de comentário válido.' });
    });
});

module.exports = router;
