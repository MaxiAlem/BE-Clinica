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
  Especialidad.belongsToMany(models.Profesional, {
    through: models.ProfesionalEspecialidad,
    foreignKey: 'especialidadId',
    otherKey: 'profesionalId',
    as: 'profesionales'
  });
};
export default Especialidad;
