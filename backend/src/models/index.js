const Finca = require('./fincaModel');
const Actividad = require('./actividadModel');
const Propietario = require('./propietarioModel');

Finca.hasMany(Actividad, {
  foreignKey: 'finca_id',
  as: 'actividades'
});

Actividad.belongsTo(Finca, {
  foreignKey: 'finca_id',
  as: 'finca'
});

Finca.belongsToMany(Propietario, {
  through: 'finca_propietario',
  foreignKey: 'finca_id',
  otherKey: 'propietario_id',
  as: 'propietarios'
});

Propietario.belongsToMany(Finca, {
  through: 'finca_propietario',
  foreignKey: 'propietario_id',
  otherKey: 'finca_id',
  as: 'fincas'
});

module.exports = {
  Finca,
  Actividad,
  Propietario
};