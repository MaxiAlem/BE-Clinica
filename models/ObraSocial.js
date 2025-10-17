import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const ObraSocial = sequelize.define('ObraSocial', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: 'compositeIndex', // nombre único por organización
  },
  organizacionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    references: {
      model: 'organizaciones', // nombre exacto de la tabla de organizaciones
      key: 'id'
    }
  }
}, {
  paranoid: true, // Para soft delete
  timestamps: true,
  tableName: 'obras_sociales',
  indexes: [
    {
      unique: true,
      fields: ['nombre', 'organizacionId'] // nombre único dentro de la organización
    }
  ]
});

ObraSocial.associate = (models) => {
  ObraSocial.hasMany(models.Paciente, {
    foreignKey: 'obraSocialId',
    as: 'pacientes',
  });

  ObraSocial.belongsTo(models.Organizacion, {
    foreignKey: 'organizacionId',
    as: 'organizacion'
  });
};

export default ObraSocial;
