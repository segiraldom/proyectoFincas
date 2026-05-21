const express = require('express');

const router = express.Router();

const {
  getEstadisticas
} = require('../controllers/estadisticaController');

router.get('/', getEstadisticas);

module.exports = router;