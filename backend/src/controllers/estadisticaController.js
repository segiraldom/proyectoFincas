const { Finca, Actividad, Propietario } = require('../models');
const sequelize = require('../config/database');

const getEstadisticas = async (req, res) => {

  try {

    const totalFincas = await Finca.count();

    const totalActividades = await Actividad.count();

    const totalPropietarios = await Propietario.count();

    const hectareas = await Finca.sum('area_total_hectareas');

    const actividadesPorTipo = await Actividad.findAll({
      attributes: [
        'tipo',
        [sequelize.fn('COUNT', sequelize.col('tipo')), 'total']
      ],
      group: ['tipo']
    });

    res.json({
      totalFincas,
      totalActividades,
      totalPropietarios,
      totalHectareas: hectareas || 0,
      actividadesPorTipo
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

module.exports = {
  getEstadisticas
};