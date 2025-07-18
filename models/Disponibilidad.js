import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';  

const Disponibilidad = sequelize.define('Disponibilidad', {
  dia: {
    type: DataTypes.ENUM('lunes','martes','miercoles','jueves','viernes','sabado'),
    allowNull: false
  },
  turno: {
    type: DataTypes.ENUM('mañana', 'mediodía', 'tarde','noche'),
    allowNull: false
  }
});

// Relacionar con la tabla Profesional
Disponibilidad.associate = (models) => {
  Disponibilidad.belongsTo(models.Profesional, {
    foreignKey: 'profesionalId',
    as: 'profesional'
  });
};

export default Disponibilidad;
