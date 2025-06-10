// models/ProfesionalEspecialidad.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const ProfesionalEspecialidad = sequelize.define('ProfesionalEspecialidad', {
  profesionalId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'profesionales',
      key: 'id'
    }
  },
  especialidadId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'especialidades',
      key: 'id'
    }
  }
}, {
  tableName: 'profesional_especialidades',
  timestamps: true
});

export default ProfesionalEspecialidad;
