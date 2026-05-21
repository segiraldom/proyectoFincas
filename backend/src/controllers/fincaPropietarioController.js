const { FincaPropietario } = require('../models');

exports.crear = async (req, res, next) => {
  try {
    const { finca_id, propietario_id } = req.body;
    if (!finca_id || !propietario_id) {
      return res.status(400).json({ message: 'finca_id y propietario_id son requeridos' });
    }
    await FincaPropietario.findOrCreate({
      where: { finca_id, propietario_id },
      defaults: { finca_id, propietario_id },
    });
    res.status(201).json({ ok: true });
  } catch (error) {
    next(error);
  }
};