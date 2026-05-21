const {
  Finca,
  Actividad,
  Propietario
} = require('../models');

const getAllFincas = async (req, res) => {

  try {

    const fincas = await Finca.findAll({

      include: [

        {
          model: Actividad,
          as: 'actividades'
        },

        {
          model: Propietario,
          as: 'propietarios',
          through: {
            attributes: []
          }
        }

      ]

    });

    res.json(fincas);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

const getFincaById = async (req, res) => {

  try {

    const finca = await Finca.findByPk(req.params.id, {

      include: [

        {
          model: Actividad,
          as: 'actividades'
        },

        {
          model: Propietario,
          as: 'propietarios',
          through: {
            attributes: []
          }
        }

      ]

    });

    if (!finca) {

      return res.status(404).json({
        message: 'Finca no encontrada'
      });

    }

    res.json(finca);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

const createFinca = async (req, res) => {

  try {

    const {
      propietarios,
      ...fincaData
    } = req.body;

    const finca = await Finca.create(fincaData);

    if (propietarios && propietarios.length > 0) {

      await finca.setPropietarios(propietarios);

    }

    const fincaCompleta = await Finca.findByPk(finca.id, {

      include: [
        {
          model: Propietario,
          as: 'propietarios',
          through: {
            attributes: []
          }
        }
      ]

    });

    res.status(201).json(fincaCompleta);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

const updateFinca = async (req, res) => {

  try {

    const finca = await Finca.findByPk(req.params.id);

    if (!finca) {

      return res.status(404).json({
        message: 'Finca no encontrada'
      });

    }

    const {
      propietarios,
      ...fincaData
    } = req.body;

    await finca.update(fincaData);

    if (propietarios) {

      await finca.setPropietarios(propietarios);

    }

    res.json(finca);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

const deleteFinca = async (req, res) => {

  try {

    const finca = await Finca.findByPk(req.params.id);

    if (!finca) {

      return res.status(404).json({
        message: 'Finca no encontrada'
      });

    }

    await finca.destroy();

    res.json({
      message: 'Finca eliminada correctamente'
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

module.exports = {
  getAllFincas,
  getFincaById,
  createFinca,
  updateFinca,
  deleteFinca
};