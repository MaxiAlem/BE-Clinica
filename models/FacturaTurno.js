import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const FacturaTurno = sequelize.define('FacturaTurno', {
  facturaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  turnoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  paciente: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  costoTotal: {
    type: DataTypes.DECIMAL(20, 2),
    allowNull: false,
    defaultValue: 0,
  },
  sena: {
    type: DataTypes.DECIMAL(20, 2),
    allowNull: true,
    defaultValue: 0,
  },
  nota: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  obraSocial: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tiempoAbarcado: {
    type: DataTypes.JSON, // { start: ..., end: ... } si querés guardar rango
    allowNull: true,
  },
}, {
  tableName: 'facturasTurnos',
  paranoid: true,
  timestamps: true,
});

FacturaTurno.associate = (models) => {
  FacturaTurno.belongsTo(models.FacturacionInterna, { foreignKey: 'facturaId', as: 'factura' });
  FacturaTurno.belongsTo(models.Turno, { foreignKey: 'turnoId', as: 'turno' });
};

export default FacturaTurno;
