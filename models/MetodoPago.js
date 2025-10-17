import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const MetodoPago = sequelize.define('MetodoPago', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  organizacionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    references: {
      model: 'organizaciones',
      key: 'id'
    }
  }
}, {
  paranoid: true,
  timestamps: true,
  tableName: 'metodos_pago',
});

// Asociaciones
MetodoPago.associate = (models) => {
  MetodoPago.belongsTo(models.Organizacion, {
    foreignKey: 'organizacionId',
    as: 'organizacion'
  });
  // MetodoPago.hasMany(models.Turno, { foreignKey: 'metodoId', as: 'turnos' });
};

export default MetodoPago;
