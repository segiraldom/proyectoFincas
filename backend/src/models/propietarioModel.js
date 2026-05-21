const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Propietario = sequelize.define('Propietario', {

  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },

  documento: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  telefono: {
    type: DataTypes.STRING
  },

  correo: {
    type: DataTypes.STRING
  },

  fecha_registro: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }

}, {
  tableName: 'propietarios',
  timestamps: false
});

module.exports = Propietario;