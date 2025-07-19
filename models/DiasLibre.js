import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const DiaLibre = sequelize.define('DiaLibre', {
  fechaInicio: {
    type: DataTypes.DATE,
    allowNull: false
  },
  fechaFin: {
    type: DataTypes.DATE,
    allowNull: false
  },
  motivo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  profesionalId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'profesionales', // nombre exacto de la tabla referenciada
      key: 'id'
    }
  }
}, {
  timestamps: true,
  paranoid: true,
  tableName: 'dias_libres'
});

DiaLibre.associate = (models) => {
  DiaLibre.belongsTo(models.Profesional, {
    foreignKey: 'profesionalId',
    as: 'profesional'
  });
};

export default DiaLibre;
