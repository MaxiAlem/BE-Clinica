import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const UsuarioProfesional = sequelize.define('UsuarioProfesional', {
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios', // nombre de la tabla usuarios
      key: 'id'
    }
  },
  profesionalId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'profesionales', // nombre de la tabla profesionales
      key: 'id'
    }
  },
  permiso: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'ver'
  }
}, {
  paranoid: true,
  timestamps: true,
  tableName: 'usuarios_profesionales',
});

// Asociaciones (para el modelo intermedio)
UsuarioProfesional.associate = (models) => {
  UsuarioProfesional.belongsTo(models.Usuario, {
    foreignKey: 'usuarioId',
    as: 'usuario',
  });
  UsuarioProfesional.belongsTo(models.Profesional, {
    foreignKey: 'profesionalId',
    as: 'profesional',
  });
};

export default UsuarioProfesional;