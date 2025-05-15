import { Sequelize, DataTypes,Op } from 'sequelize';
import sequelize from '../config/db.js';  


const Profesional = sequelize.define('Profesional', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cuil: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  dni: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  matricula: {
    type: DataTypes.STRING,
    allowNull: false
  },
  especialidad: {
    type: DataTypes.STRING,
    allowNull: false
  },
  titulo: {
    type: DataTypes.STRING, // Este campo es opcional
    allowNull: true
  },
   slug: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fechaNacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  paranoid: true, // soft deletes: agrega deletedAt
  timestamps: true, // createdAt / updatedAt
  tableName: 'profesionales', // nombre en base de datos
});

// Relacionar con la tabla de Disponibilidad (más adelante)
Profesional.associate = (models) => {
  Profesional.hasMany(models.Disponibilidad, {
    foreignKey: 'profesionalId',
    as: 'disponibilidades'
  });
  Profesional.hasMany(models.Turno, {
    foreignKey: 'profesionalId',
    as: 'turnos'
  });
};

Profesional.beforeCreate(async (profesional, options) => {
  if (!profesional.slug && profesional.nombre && profesional.apellido) {
    const baseSlug = `${profesional.nombre}-${profesional.apellido}`
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');

    let slug = baseSlug;
    let contador = 1;

    // Verificamos si ya existe el slug
    while (
      await Profesional.findOne({
        where: { slug },
        paranoid: false // Incluye eliminados soft
      })
    ) {
      slug = `${baseSlug}-${contador++}`;
    }

    profesional.slug = slug;
  }
});

export default Profesional;
