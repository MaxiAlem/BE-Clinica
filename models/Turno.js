import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Turno = sequelize.define('Turno', {
  start: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  porcentajeCobertura: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0,
  },
  costoTotal: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  sena: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0,
  },
  motivo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'confirmado', 'cancelado', 'finalizado'),
    allowNull: false,
    defaultValue: 'pendiente',
  },
  notas: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tipo: {
    type: DataTypes.ENUM('turno', 'sobreturno'),
    allowNull: true,
    defaultValue: 'turno',
  },
  organizacionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  // 👇 FK opcionales para evitar conflictos con ON DELETE
  pacienteId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  profesionalId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  profesionalDerivaId: { // 👈 nuevo campo agregado
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  obraSocialId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  metodoPagoId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  paranoid: true, // habilita soft delete
  timestamps: true,
  tableName: 'turnos',
});

Turno.associate = (models) => {
  Turno.belongsTo(models.Paciente, {
    foreignKey: {
      name: 'pacienteId',
      allowNull: true, // 👈 importante
    },
    as: 'paciente',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });

  Turno.belongsTo(models.Profesional, {
    foreignKey: {
      name: 'profesionalId',
      allowNull: true,
    },
    as: 'profesional',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });
    // Profesional que deriva
    Turno.belongsTo(models.Profesional, {
      foreignKey: {
        name: 'profesionalDerivaId',
        allowNull: true,
      },
      as: 'profesionalDeriva',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
 

  Turno.belongsTo(models.ObraSocial, {
    foreignKey: {
      name: 'obraSocialId',
      allowNull: true,
    },
    as: 'obraSocial',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });

  Turno.belongsTo(models.MetodoPago, {
    foreignKey: {
      name: 'metodoPagoId',
      allowNull: true,
    },
    as: 'metodoPago',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });

  Turno.belongsTo(models.Organizacion, {
    foreignKey: {
      name: 'organizacionId',
      allowNull: false,
      defaultValue: 1,
    },
    as: 'organizacion',
  });
};

export default Turno;
