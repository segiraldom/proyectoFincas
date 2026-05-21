const { Actividad, Finca } = require('../models');

const getAllActividades = async (req, res) => {

  try {

    const actividades = await Actividad.findAll({
      include: [
        {
          model: Finca,
          as: 'finca'
        }
      ]
    });

    res.json(actividades);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

const createActividad = async (req, res) => {

  try {

    const { finca_id, tipo } = req.body;

    if (!finca_id || !tipo) {
      return res.status(400).json({
        message: 'finca_id y tipo son obligatorios'
      });
    }

    const finca = await Finca.findByPk(finca_id);

    if (!finca) {
      return res.status(400).json({
        message: 'La finca asociada no existe'
      });
    }

    const actividad = await Actividad.create(req.body);

    res.status(201).json(actividad);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

const getActividadById = async (req, res) => {
  try {
    const actividad = await Actividad.findByPk(req.params.id, {
      include: [{ model: Finca, as: 'finca' }]
    });

    if (!actividad) {
      return res.status(404).json({ message: 'Actividad no encontrada' });
    }

    res.json(actividad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateActividad = async (req, res) => {

  try {

    const actividad = await Actividad.findByPk(req.params.id);

    if (!actividad) {
      return res.status(404).json({
        message: 'Actividad no encontrada'
      });
    }

    await actividad.update(req.body);

    res.json(actividad);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

const deleteActividad = async (req, res) => {

  try {

    const actividad = await Actividad.findByPk(req.params.id);

    if (!actividad) {
      return res.status(404).json({
        message: 'Actividad no encontrada'
      });
    }

    await actividad.destroy();

    res.json({
      message: 'Actividad eliminada correctamente'
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

module.exports = {
  getAllActividades,
  getActividadById,
  createActividad,
  updateActividad,
  deleteActividad
};