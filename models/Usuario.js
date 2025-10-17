import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Usuario = sequelize.define('Usuario', {
  usuario: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rolId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  organizacionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1, // ID de la organización default que creaste
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  paranoid: true, // borrado lógico
  timestamps: true, // createdAt / updatedAt
  tableName: 'usuarios',
  indexes: [
    {
      unique: true,
      fields: ['usuario', 'organizacionId'], // unicidad por organización
    }
  ]
});

// Asociaciones
Usuario.associate = (models) => {
  // Relación con Organización
  Usuario.belongsTo(models.Organizacion, { foreignKey: 'organizacionId', as: 'organizacion' });

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
