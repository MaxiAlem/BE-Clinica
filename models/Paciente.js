import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Paciente = sequelize.define('Paciente', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fechaNacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  obraSocial: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dni: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  genero: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  estadoCivil: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fechaAlta: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  paranoid: true, // Para borrado lógico (deletedAt)
  timestamps: true, // createdAt, updatedAt
  tableName: 'pacientes',
});

// Asociación pendiente (la armamos cuando tengas el modelo Turno listo)
Paciente.associate = (models) => {
  Paciente.hasMany(models.Turno, {
    foreignKey: 'pacienteId',
    as: 'turnos',
  });
};

export default Paciente;
