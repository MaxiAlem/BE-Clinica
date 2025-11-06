// models/FacturacionInterna.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const FacturacionInterna = sequelize.define(
  'FacturacionInterna',
  {
    facturaNum: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true 
    },
    titulo: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    profesionalId: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    periodoDesde: { 
      type: DataTypes.DATE, 
      allowNull: false 
    },
    periodoHasta: { 
      type: DataTypes.DATE, 
      allowNull: false 
    },
    total: { 
      type: DataTypes.DECIMAL(10, 2), 
      allowNull: false, 
      defaultValue: 0 
    },
    query: DataTypes.JSON,
    creadoPor: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    organizacionId: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
  },
  {
    tableName: 'facturasinternas',
    paranoid: true,
    timestamps: true,
  }
);

// Asociaciones
FacturacionInterna.associate = (models) => {
  // Turnos de la factura
  FacturacionInterna.hasMany(models.FacturaTurno, { 
    foreignKey: 'facturaId', 
    as: 'turnos' 
  });

  // Profesional asociado a la factura
  FacturacionInterna.belongsTo(models.Profesional, { 
    foreignKey: 'profesionalId', 
    as: 'profesional' 
  });
};

export default FacturacionInterna;
