const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Finca = sequelize.define('Finca', {

  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },

  departamento: {
    type: DataTypes.STRING,
    allowNull: false
  },

  municipio: {
    type: DataTypes.STRING,
    allowNull: false
  },

  area_total_hectareas: {
    type: DataTypes.FLOAT
  },

  latitud: {
    type: DataTypes.FLOAT
  },

  longitud: {
    type: DataTypes.FLOAT
  },

  fecha_registro: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }

}, {
  tableName: 'fincas',
  timestamps: false
});

module.exports = Finca;