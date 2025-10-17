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
  dni: {
    type: DataTypes.STRING,
    allowNull: true,
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
  obraSocialId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  nAfiliado: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  organizacionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
}, {
  paranoid: true,
  timestamps: true,
  tableName: 'pacientes',
  indexes: [
    {
      unique: true,
      fields: ['organizacionId', 'dni'], // Unicidad compuesta
    },
  ],
});

Paciente.associate = (models) => {
  Paciente.hasMany(models.Turno, {
    foreignKey: 'pacienteId',
    as: 'turnos',
  });
  Paciente.belongsTo(models.ObraSocial, {
    foreignKey: 'obraSocialId',
    as: 'obraSocial',
  });
  Paciente.belongsTo(models.Organizacion, {
    foreignKey: 'organizacionId',
    as: 'organizacion',
  });
};

export default Paciente;
