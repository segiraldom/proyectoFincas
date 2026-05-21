const sequelize = require('../config/database');
const { Finca, Propietario, Actividad } = require('../models');

const syncBatch = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      propietarios = [],
      fincas = [],
      actividades = [],
      finca_propietario = []
    } = req.body || {};

    const created = {
      propietarios: 0,
      fincas: 0,
      actividades: 0,
      asociaciones: 0
    };

    for (const propietario of propietarios) {
      await Propietario.findOrCreate({
        where: { id: propietario.id },
        defaults: propietario,
        transaction
      });
      created.propietarios += 1;
    }

    for (const finca of fincas) {
      await Finca.findOrCreate({
        where: { id: finca.id },
        defaults: finca,
        transaction
      });
      created.fincas += 1;
    }

    for (const actividad of actividades) {
      await Actividad.findOrCreate({
        where: { id: actividad.id },
        defaults: actividad,
        transaction
      });
      created.actividades += 1;
    }

    for (const relacion of finca_propietario) {
      const finca = await Finca.findByPk(relacion.finca_id, { transaction });
      const propietario = await Propietario.findByPk(relacion.propietario_id, { transaction });

      if (finca && propietario) {
        await finca.addPropietario(propietario, { transaction });
        created.asociaciones += 1;
      }
    }

    await transaction.commit();

    res.json({
      message: 'Sincronización procesada correctamente',
      resumen: created
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

module.exports = {
  syncBatch
};
