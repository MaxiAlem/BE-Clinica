// models/ObraSocial.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const ObraSocial = sequelize.define('ObraSocial', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  paranoid: true, // Para soft delete
  timestamps: true,
  tableName: 'obras_sociales',
});

ObraSocial.associate = (models) => {
  ObraSocial.hasMany(models.Paciente, {
    foreignKey: 'obraSocialId',
    as: 'pacientes',
  });
};

export default ObraSocial;
