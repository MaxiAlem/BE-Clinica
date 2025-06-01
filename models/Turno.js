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
  obraSocialId: {  // Cambiado de 'obraSocial' STRING a 'obraSocialId' INTEGER
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'obras_sociales', 
      key: 'id'
    }
  },
  metodoPagoId: {  // Nuevo campo para método de pago
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
  }
}, {
  paranoid: true,
  timestamps: true,
  tableName: 'turnos'
});

// Asociaciones que haríamos (asumiendo que ya definiste Paciente y Profesional)

Turno.associate = (models) => {
  Turno.belongsTo(models.Paciente, { foreignKey: 'pacienteId', as: 'Paciente' });
  Turno.belongsTo(models.Profesional, { foreignKey: 'profesionalId', as: 'Profesional' });
  Turno.belongsTo(models.ObraSocial, { foreignKey: 'obraSocialId', as: 'ObraSocial' });
  Turno.belongsTo(models.MetodoPago, { foreignKey: 'metodoPagoId', as: 'MetodoPago' });
};

export default Turno;
