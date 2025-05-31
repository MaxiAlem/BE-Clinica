import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Rol from './Role.js';

// models/Usuario.js
const Usuario = sequelize.define('Usuario', {
  usuario: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // rol: {
  //   type: DataTypes.ENUM('admin','recepcion'),
  //   allowNull: false,
  //   defaultValue: 'recepcion',
  // },
  rolId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'roles',
      key: 'id'
    }
  },
},
  {
    paranoid: true, // soft deletes: agrega deletedAt
    timestamps: true, // createdAt / updatedAt
    tableName: 'usuarios', // nombre en base de datos
  }
);

// Asociaciones
Usuario.belongsTo(Rol, { foreignKey: 'rolId', as: 'rol' });
Rol.hasMany(Usuario, { foreignKey: 'rolId', as: 'usuarios' });

export default Usuario;