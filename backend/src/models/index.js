const Finca = require('./fincaModel');
const Actividad = require('./actividadModel');
const Propietario = require('./propietarioModel');
const FincaPropietario = require('./fincaPropietarioModel');

Finca.hasMany(Actividad, {
  foreignKey: 'finca_id',
  as: 'actividades'
});

Actividad.belongsTo(Finca, {
  foreignKey: 'finca_id',
  as: 'finca'
});

Finca.belongsToMany(Propietario, {
  through: FincaPropietario,
  foreignKey: 'finca_id',
  otherKey: 'propietario_id',
  as: 'propietarios'
});

Propietario.belongsToMany(Finca, {
  through: FincaPropietario,
  foreignKey: 'propietario_id',
  otherKey: 'finca_id',
  as: 'fincas'
});

module.exports = {
  Finca,
  Actividad,
  Propietario,
  FincaPropietario
};