// models/Especialidad.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Especialidad = sequelize.define('Especialidad', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  paranoid: true,
  timestamps: true,
  tableName: 'especialidades',
});

Especialidad.associate = (models) => {
  Especialidad.hasMany(models.Profesional, {
    foreignKey: 'especialidadId',
    as: 'profesionales',
  });
};

export default Especialidad;
