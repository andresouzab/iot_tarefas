const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');

const Usuario = sequelize.define('Usuario', {
  // Model attributes are defined here
  id_usuarios: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  usuario: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // Other model options go here
});
module.exports = Usuario;
// `sequelize.define` also returns the model
