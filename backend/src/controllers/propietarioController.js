const { Propietario } = require('../models');

const getAllPropietarios = async (req, res) => {

  try {

    const propietarios = await Propietario.findAll();

    res.json(propietarios);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

const createPropietario = async (req, res) => {

  try {

    const propietario = await Propietario.create(req.body);

    res.status(201).json(propietario);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

module.exports = {
  getAllPropietarios,
  createPropietario
};