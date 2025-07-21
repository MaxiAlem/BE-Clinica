import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Usuario = sequelize.define('Usuario', {
  usuario: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rolId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'roles',
      key: 'id'
    }
  },
}, {
  paranoid: true, // soft deletes
  timestamps: true,
  tableName: 'usuarios',
});

// Asociaciones
Usuario.associate = (models) => {
  // Relación con Rol
  Usuario.belongsTo(models.Rol, { foreignKey: 'rolId', as: 'rol' });
  models.Rol.hasMany(Usuario, { foreignKey: 'rolId', as: 'usuarios' });
  
  // Relación N a N con Profesional
  Usuario.belongsToMany(models.Profesional, {
    through: models.UsuarioProfesional,
    foreignKey: 'usuarioId',
    otherKey: 'profesionalId',
    as: 'profesionales'
  });
};

export default Usuario;