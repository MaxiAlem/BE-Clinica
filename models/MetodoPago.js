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
    allowNull: true
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  paranoid: true,
  timestamps: true,
  tableName: 'metodos_pago',
});

// MetodoPago.associate = (models) => {
//     MetodoPago.hasMany(models.Turno, {
//     foreignKey: 'metodoId',
//     as: 'turnos',
//   });
// };

export default MetodoPago;
