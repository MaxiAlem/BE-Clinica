import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Turno = sequelize.define('Turno', {
  start: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end: {
    type: DataTypes.DATE,
    allowNull: false
  },
  pacienteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'pacientes',
      key: 'id'
    }
  },
  profesionalId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'profesionales',
      key: 'id'
    }
  },
  obraSocial: {
    type: DataTypes.STRING,
    allowNull: true
  },
  porcentajeCobertura: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0
  },
  costoTotal: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  sena: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0
  },
  motivo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'confirmado', 'cancelado', 'finalizado'),
    allowNull: false,
    defaultValue: 'pendiente'
  },
  notas: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  paranoid: true,
  timestamps: true,
  tableName: 'turnos'
});

// Asociaciones que haríamos (asumiendo que ya definiste Paciente y Profesional)

Turno.associate = (models) => {
  Turno.belongsTo(models.Paciente, { foreignKey: 'pacienteId', as: 'paciente' });
  Turno.belongsTo(models.Profesional, { foreignKey: 'profesionalId', as: 'profesional' });
};

export default Turno;
