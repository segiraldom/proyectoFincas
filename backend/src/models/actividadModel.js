const { DataTypes } =
require('sequelize');

const sequelize =
require('../config/database');

const Actividad =
sequelize.define('Actividad', {

  id: {
    type: DataTypes.UUID,
    defaultValue:
      DataTypes.UUIDV4,
    primaryKey: true
  },

  finca_id: {
    type: DataTypes.UUID,
    allowNull: false
  },

  tipo: {
    type: DataTypes.STRING,
    allowNull: false
  },

  descripcion: {
    type: DataTypes.TEXT
  },

  cantidad: {
    type: DataTypes.FLOAT
  },

  unidad: {
    type: DataTypes.STRING
  },

  produccion: {
    type: DataTypes.FLOAT
  },

  unidad_produccion: {
    type: DataTypes.STRING
  },

  area_hectareas: {
    type: DataTypes.FLOAT
  }

}, {
  tableName: 'actividades',
  timestamps: false
});

module.exports = Actividad;