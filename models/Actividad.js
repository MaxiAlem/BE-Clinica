import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Usuario from "./Usuario.js"; // si ya tenés tu modelo de usuario

const Actividad = sequelize.define("Actividad", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  entidad: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  entidadId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  organizacionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
  paranoid: false,
  tableName: "actividades"
});

// Relaciones (si tu modelo Usuario existe)
Actividad.belongsTo(Usuario, { foreignKey: "usuarioId", as: "usuario" });

export default Actividad;
