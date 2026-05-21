const express = require('express');

const router = express.Router();

const {
  getAllActividades,
  createActividad,
  updateActividad,
  deleteActividad
} = require('../controllers/actividadController');

router.get('/', getAllActividades);

router.post('/', createActividad);

router.put('/:id', updateActividad);

router.delete('/:id', deleteActividad);

module.exports = router;