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
  obraSocialId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'obras_sociales',
      key: 'id'
    }
  },
  metodoPagoId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'metodos_pago',
      key: 'id'
    }
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
  },
  tipo: {
    type: DataTypes.ENUM('turno', 'sobreturno'),
    allowNull: true,
    defaultValue: 'turno'
  }
}, {
  paranoid: true,
  timestamps: true,
  tableName: 'turnos'
});

// Asociaciones
Turno.associate = (models) => {
  Turno.belongsTo(models.Paciente, { foreignKey: 'pacienteId', as: 'Paciente' });
  Turno.belongsTo(models.Profesional, { foreignKey: 'profesionalId', as: 'Profesional' });
  Turno.belongsTo(models.ObraSocial, { foreignKey: 'obraSocialId', as: 'ObraSocial' });
  Turno.belongsTo(models.MetodoPago, { foreignKey: 'metodoPagoId', as: 'MetodoPago' });
};

export default Turno;