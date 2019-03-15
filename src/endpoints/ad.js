const express = require('express');

const router = express.Router();
const AdModel = require('../model/Ad');

const uploader = require('../configurations/cloudinary');

router.post('/users/:id',
  uploader.fields([{ name: 'image1' }, { name: 'image2' }, { name: 'image3' }, { name: 'image4' }, { name: 'image5' }]), (req, res) => {

    const { title, description, pricePerDay, state, category } = req.body;
    console.log(title, description, pricePerDay, state, category);

    const errors = {};

    if (!req.params.id) {
      errors.ownerId = 'Obrigatório que o produto possua o id do dono';
    }

    if (title.length < 4) {
      errors.title = 'O título deve conter no mínimo 4 caracteres.';
    }

    if (!description) {
      errors.description = 'Digite uma descrição.';
    }

    if (pricePerDay < 1) {
      errors.pricePerDay = 'O valor do aluguel por dia deve ser de no mínimo R$ 1.';
    }

    const states = { AC: 1, AL: 2, AP: 3, AM: 4, BA: 5, CE: 6, DF: 7, ES: 8, GO: 9, MA: 10, MT: 11, MS: 12, MG: 13, PA: 14, PB: 15, PR: 16, PE: 17, PI: 18, RJ: 19, RN: 20, RS: 21, RO: 22, RR: 23, SC: 24, SP: 25, SE: 26, TO: 27 };

    if (!(state in states)) {
      errors.state = 'Selecione um Estado válido';
    }

    if (Object.keys(errors).length !== 0) {
      console.error(errors);
      res.status(422).json(errors);
      return;
    }

    const pathPictures = [];
    if (req.files) {
      for (let prop in req.files) {
        pathPictures.push(req.files[prop][0].url);
      }
    }

    const newAd = new AdModel({ category, ownerId: req.params.id, title, description, pricePerDay, pathPictures, state });

    newAd.save()
      .then((ad) => {
        res.status(201).json(ad);
      })
      .catch((err) => {
        console.error(err);
        res.status(400).json(err);
      });
  });

router.put('/:id',
  uploader.fields([{ name: 'image1' }, { name: 'image2' }, { name: 'image3' }, { name: 'image4' }, { name: 'image5' }]), (req, res) => {

    const { title, description, pricePerDay, state } = req.body;

    const errors = {};

    if (!req.params.id) {
      errors.ownerId = 'Obrigatório que o produto possua o id do dono';
    }

    if (title.length < 4) {
      errors.title = 'O título deve conter no mínimo 4 caracteres.';
    }

    if (!description) {
      errors.description = 'Digite uma descrição.';
    }

    if (pricePerDay < 1) {
      errors.pricePerDay = 'O valor do aluguel por dia deve ser de no mínimo R$ 1.';
    }

    const states = { AC: 1, AL: 2, AP: 3, AM: 4, BA: 5, CE: 6, DF: 7, ES: 8, GO: 9, MA: 10, MT: 11, MS: 12, MG: 13, PA: 14, PB: 15, PR: 16, PE: 17, PI: 18, RJ: 19, RN: 20, RS: 21, RO: 22, RR: 23, SC: 24, SP: 25, SE: 26, TO: 27 };

    if (!(state in states)) {
      errors.state = 'Selecione um Estado válido';
    }

    if (Object.keys(errors).length !== 0) {
      res.status(422).json(errors);
      return;
    }

    const pathPictures = [];
    if (req.files) {
      for (let prop in req.files) {
        pathPictures.push(req.files[prop][0].url);
      }
    }

    const newAd = new AdModel({ ownerId: req.params.id, title, description, pricePerDay, pathPictures, state });

    newAd.findOneAndUpdate({ _id: req.params.id }, { ownerId: req.params.id, title, description, pricePerDay, pathPictures, state })
      .then((ad) => {
        res.status(201).json(ad);
      })
      .catch((err) => {
        console.error(err);
        res.status(400).json(err);
      });
  });

// Search one ad by id
router.get('/:id', (req, res) => {
  AdModel.findOne({ _id: req.params.id })
    .then((ad) => {
      if (ad !== null) {
        res.status(200).json(ad);
      } else {
        res.status(404).json({ message: 'Anúncio não encontrado.' });
      }
    })
    .catch((err) => {
      res.status(404).json({ message: 'Insira um id de anúncio válido' });
    });
});

// Search ads by idOwner
router.get('/users/:id', (req, res) => {
  AdModel.find({ ownerId: req.params.id })
    .then((ad) => {
      if (ad.length) {
        res.status(200).json(ad);
      } else {
        res.status(404).json({ message: 'Não foram encontrados anúncios deste dono.' });
      }
    })
    .catch((err) => {
      res.status(404).json({ message: 'Insira um id de usuário válido.' });
    });
});

// Filter by State
router.get('', (req, res) => {
  const states = { AC: 1, AL: 2, AP: 3, AM: 4, BA: 5, CE: 6, DF: 7, ES: 8, GO: 9, MA: 10, MT: 11, MS: 12, MG: 13, PA: 14, PB: 15, PR: 16, PE: 17, PI: 18, RJ: 19, RN: 20, RS: 21, RO: 22, RR: 23, SC: 24, SP: 25, SE: 26, TO: 27 };
  const state = req.query.state.toUpperCase();
  if (!(state in states)) {
    res.status(422).json({ message: "A sigla do estado está errada. Tente filtrar pela sigla do estado. Exemplo: 'SP', 'RJ' ..." });
  }

  AdModel.find({ state })
    .then((ads) => {
      if (ads.length) {
        res.status(200).json(ads);
      } else {
        res.status(200).json(ads);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(404).json({ message: 'Erro ao buscar o anúncio por estado.' });
    });
});

// Delete ad by id
router.delete('/:id', (req, res) => {
  AdModel.remove({ _id: req.params.id })
    .then(() => {
      res.status(204).json();
    })
    .catch((err) => {
      console.error(err);
      res.status(404).json({ message: 'Insira um id de anúncio válido.' });
    });
});

module.exports = router;
