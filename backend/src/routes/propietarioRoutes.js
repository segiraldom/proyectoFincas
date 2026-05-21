const express = require('express');

const router = express.Router();

const {
  getAllPropietarios,
  getPropietarioById,
  createPropietario,
  updatePropietario,
  deletePropietario
} = require('../controllers/propietarioController');

router.get('/', getAllPropietarios);

router.get('/:id', getPropietarioById);

router.post('/', createPropietario);

router.put('/:id', updatePropietario);

router.delete('/:id', deletePropietario);

module.exports = router;