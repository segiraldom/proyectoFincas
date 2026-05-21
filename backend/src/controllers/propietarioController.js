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

    const { nombre, documento } = req.body;

    if (!nombre || !documento) {
      return res.status(400).json({
        message: 'nombre y documento son obligatorios'
      });
    }

    const propietario = await Propietario.create(req.body);

    res.status(201).json(propietario);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

const getPropietarioById = async (req, res) => {
  try {
    const propietario = await Propietario.findByPk(req.params.id);

    if (!propietario) {
      return res.status(404).json({
        message: 'Propietario no encontrado'
      });
    }

    res.json(propietario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePropietario = async (req, res) => {
  try {
    const propietario = await Propietario.findByPk(req.params.id);

    if (!propietario) {
      return res.status(404).json({
        message: 'Propietario no encontrado'
      });
    }

    await propietario.update(req.body);
    res.json(propietario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePropietario = async (req, res) => {
  try {
    const propietario = await Propietario.findByPk(req.params.id);

    if (!propietario) {
      return res.status(404).json({
        message: 'Propietario no encontrado'
      });
    }

    await propietario.destroy();

    res.json({
      message: 'Propietario eliminado correctamente'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllPropietarios,
  getPropietarioById,
  createPropietario,
  updatePropietario,
  deletePropietario
};