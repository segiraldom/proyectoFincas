const express = require('express');

const router = express.Router();

const {
  getAllFincas,
  getFincaById,
  createFinca,
  updateFinca,
  deleteFinca
} = require('../controllers/fincaController');

router.get('/', getAllFincas);

router.get('/:id', getFincaById);

router.post('/', createFinca);

router.put('/:id', updateFinca);

router.delete('/:id', deleteFinca);

module.exports = router;