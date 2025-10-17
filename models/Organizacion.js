import { Sequelize, DataTypes,Op } from 'sequelize';
import sequelize from '../config/db.js';  


const Organizacion = sequelize.define('Organizacion', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
      },
      nombreLegal: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contactoNombre: {
        type: DataTypes.STRING,
        allowNull: false
      },
      contactoEmail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contactoTelefono: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      direccionCalle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      direccionCiudad: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      direccionCodigoPostal: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      direccionPais: {
        type: DataTypes.STRING,
        allowNull: true,
      },
        timezone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // único globalmente, porque es el subdominio
        validate: {
          is: /^[a-z0-9]+(?:-[a-z0-9]+)*$/ // formato slug
        }
      },
      nota: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      terminosAceptados: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      fechaActivacion: {
        type: DataTypes.DATE,
      allowNull: true}, 
    fechaExpiracion: {
        type: DataTypes.DATE,
        allowNull: true} ,
    }, {
      paranoid: true, // soft deletes: agrega deletedAt
      timestamps: true, // createdAt / updatedAt
      tableName: 'organizaciones', // nombre en base de datos
});

Organizacion.associate = (models) => {
  Organizacion.hasMany(models.Profesional, {
    foreignKey: 'organizacionId',
    as: 'profesionales'
  });
};

export default Organizacion;