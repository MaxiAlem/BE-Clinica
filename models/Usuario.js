import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';  


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
        rol: {
          type: DataTypes.ENUM('admin','recepcion'),
          allowNull: false,
          defaultValue: 'recepcion',
        },
      },
      {
        paranoid: true, // soft deletes: agrega deletedAt
        timestamps: true, // createdAt / updatedAt
        tableName: 'usuarios', // nombre en base de datos
      }
    );
  
    export default Usuario;