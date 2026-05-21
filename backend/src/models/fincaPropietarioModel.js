const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FincaPropietario = sequelize.define('FincaPropietario', {
  finca_id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true
  },
  propietario_id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true
  }
}, {
  tableName: 'finca_propietario',
  timestamps: false
});

module.exports = FincaPropietario;
