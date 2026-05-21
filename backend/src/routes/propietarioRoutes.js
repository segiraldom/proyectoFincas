const express = require('express');

const router = express.Router();

const {
  getAllPropietarios,
  createPropietario
} = require('../controllers/propietarioController');

router.get('/', getAllPropietarios);

router.post('/', createPropietario);

module.exports = router;