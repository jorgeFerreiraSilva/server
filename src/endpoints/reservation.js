const express = require('express');

const router = express.Router();
const ReservationModel = require('../model/Reservation');
const AdModel = require('../model/Ad');
const UserModel = require('../model/User');

router.post('/ads/:adId/users/:ownerId/:hirerId', (req, res) => {

  const { pricePerDay, startDate, endDate, totalPrice, title, pathPictures } = req.body;
  const { adId, ownerId, hirerId } = req.params;

  const errors = {};

  if (!adId) {
    errors.adId = 'Obrigatório que a reserva possua o id do anúncio';
  }

  if (!ownerId) {
    errors.ownerId = 'Obrigatório que a reserva possua o id do dono';
  }

  if (!hirerId) {
    errors.hirerId = 'Obrigatório que a reserva possua o id do locatário';
  }

  if (pricePerDay < 1) {
    errors.pricePerDay = 'O valor do alguel deve ser superior a R$1.';
  }

  if (!startDate) {
    errors.startDate = 'Obrigatório a data de início';
  }

  if (!endDate) {
    errors.endDate = 'Obrigatório a data de devolução';
  }

  // if (endDate < startDate) {
  //   errors.endDate = 'A data de devolução deve ser posterior a data de início';
  // }

  if (Object.keys(errors).length !== 0) {
    res.status(422).json(errors);
    return;
  }

  const newReservation = new ReservationModel({ adId, ownerId, hirerId, title, pathPictures, pricePerDay, totalPrice, startDate, endDate, status: 'Em espera' });


  AdModel.findOne({ _id: adId })
    .then((ad) => {
      if (ad === null) {
        res.status(404).json({ message: 'O anúncio não existe.' });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(422).json({ message: 'Id do anúncio inválido.' });
    });

  UserModel.findOne({ _id: ownerId })
    .then((owner) => {
      if (owner === null) {
        res.status(404).json({ message: 'O usuário dono não existe.' });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(422).json({ message: 'Id do usuário dono inválido.' });
    });

  UserModel.findOne({ _id: hirerId })
    .then((hirer) => {
      if (hirer === null) {
        res.status(404).json({ message: 'O locatário não existe.' });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(422).json({ message: 'Id do usuário locatário inválido.' });
    });

  newReservation.save()
    .then((reservation) => {
      res.status(201).json(reservation);
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json(err);
    });

});

router.patch('/:id', (req, res) => {
  const { status } = req.body;
  console.log(status);

  if (status === 'Alugando' || status === 'Finalizado' || status === 'Recusado') {

    ReservationModel.findOneAndUpdate({ _id: req.params.id }, { status }, { new: true })
      .then((reservation) => {
        res.status(201).json(reservation);
      })
      .catch((err) => {
        console.error(err);
        res.status(400).json(err);
      });
  } else {
    res.status(422).json({ message: 'O status da reserva deve ser Alugado, Finalizado ou Recusado.' });
  }
});

// Search reservation by id
router.get('/:id', (req, res) => {
  ReservationModel.find({ _id: req.params.id })
    .then((ad) => {
      if (ad.length) {
        res.status(200).json(ad);
      } else {
        res.status(404).json({ message: 'Esta reserva não existe.' });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json({ message: 'Insira um id de reserva válido.' });
    });
});

// Search reservations by idAd
router.get('/ads/:adId', (req, res) => {
  ReservationModel.find({ adId: req.params.adId })
    .then((ad) => {
      if (ad.length) {
        res.status(200).json(ad);
      } else {
        res.status(404).json({ message: 'Este anúncio não possui reservas .' });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json({ message: 'Insira um id de anúncio válido.' });
    });
});

// Search reservations by Hirer
router.get('/hirer/:hirerId', (req, res) => {
  ReservationModel.find({ hirerId: req.params.hirerId })
    .then((reservation) => {
      if (reservation.length) {
        res.status(200).json(reservation);
      } else {
        res.status(404).json({ message: 'Este locatário não possui reservas .' });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json({ message: 'Insira um id de usuário   válido.' });
    });
});

// Search reservations by Owner
router.get('/owner/:ownerId', (req, res) => {
  ReservationModel.find({ ownerId: req.params.ownerId })
    .then((reservation) => {
      if (reservation.length) {
        res.status(200).json(reservation);
      } else {
        res.status(404).json({ message: 'Este locatário não possui reservas .' });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json({ message: 'Insira um id de usuário   válido.' });
    });
});

// Search reservations by id that only status equal 'Renting' and 'Finished', just bringing startDate and endDate
router.get('/ads/:adId/status', (req, res) => {
  ReservationModel.find({ $and: [{ adId: req.params.adId }, { status: { $in: ['Alugando', 'Finalizado'] } }] }, { startDate: 1, endDate: 1 })
    .then((ad) => {
      if (ad.length) {
        res.status(200).json(ad);
      } else {
        res.status(404).json({ message: 'Este anúncio não possui reservas.' });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json({ message: 'Insira um id de anúncio válido.' });
    });
});

// Delete Reservation by id
router.delete('/:id', (req, res) => {
  ReservationModel.remove({ _id: req.params.id })
    .then(() => {
      res.status(204).json();
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json({ message: 'Insira um id de comentário válido.' });
    });
});

module.exports = router;
