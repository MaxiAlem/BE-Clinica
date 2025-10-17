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
  },
  dni: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  matricula: {
    type: DataTypes.STRING,
    allowNull: false
  },
  turnoBase: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 15, // Tiempo de turno en minutos
    comment: "Duración base del turno en minutos"
  },

  titulo: {
    type: DataTypes.STRING, // Este campo es opcional
    allowNull: true
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: /^[a-z0-9]+(?:-[a-z0-9]+)*$/ // formato slug
    }
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
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fechaNacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  organizacionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    references: {
      model: 'organizaciones',
      key: 'id'
    }
  }
}, {
  paranoid: true, // soft deletes: agrega deletedAt
  timestamps: true, // createdAt / updatedAt
  tableName: 'profesionales', // nombre en base de datos
  indexes: [
    {
      unique: true,
      fields: ['slug', 'organizacionId']
    },
    {
      unique: true,
      fields: ['dni', 'organizacionId']
    },
    {
      unique: true,
      fields: ['cuil', 'organizacionId']
    }
  ]
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
  Profesional.belongsToMany(models.Especialidad, {
    through: models.ProfesionalEspecialidad,
    foreignKey: 'profesionalId',
    otherKey: 'especialidadId',
    as: 'especialidades'
  });
  Profesional.hasMany(models.DiaLibre, {
    foreignKey: 'profesionalId',
    as: 'diasLibres'
  });
  // Relación N a N con usuario
Profesional.belongsToMany(models.Usuario, {
  through: models.UsuarioProfesional,
  foreignKey: 'profesionalId',
  otherKey: 'usuarioId',
  as: 'usuarios'
});
  Profesional.belongsTo(models.Organizacion, {
    foreignKey: 'organizacionId',
    as: 'organizacion'
  });
};

// Hook para slug único
Profesional.beforeCreate(async (profesional) => {
  if (!profesional.slug && profesional.nombre && profesional.apellido) {
    const baseSlug = `${profesional.nombre}-${profesional.apellido}`
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');

    let slug = baseSlug;
    let contador = 1;

    const existe = async (slugTest) => {
      return await Profesional.findOne({
        where: { slug: slugTest, organizacionId: profesional.organizacionId },
        paranoid: false
      });
    };

    while (await existe(slug)) {
      slug = `${baseSlug}-${contador++}`;
    }

    profesional.slug = slug;
  }
});

export default Profesional;
