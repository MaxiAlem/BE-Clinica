import Actividad from "../models/Actividad.js";
import Usuario from "../models/Usuario.js";

const tenantScope = (req) => ({ organizacionId: req.user.organizacionId });

// Obtener todas las actividades
export const obtenerActividades = async (req, res) => {
  try {
    const actividades = await Actividad.findAll({
      where: tenantScope(req),
      include: [{ model: Usuario, as: "usuario", attributes: ["id", "usuario"] }],
      order: [["createdAt", "DESC"]],
      limit: 100 // opcional: limitar resultados
    });
    res.json(actividades);
  } catch (err) {
    console.error("Error al obtener actividades:", err);
    res.status(500).json({ error: err.message });
  }
};

// Filtrar por tipo o usuario
export const filtrarActividades = async (req, res) => {
  try {
    const { tipo, usuarioId } = req.query;
    const where = { ...tenantScope(req) };

    if (tipo) where.tipo = tipo;
    if (usuarioId) where.usuarioId = usuarioId;

    const actividades = await Actividad.findAll({
      where,
      include: [{ model: Usuario, as: "usuario", attributes: ["id", "usuario"] }],
      order: [["createdAt", "DESC"]],
    });

    res.json(actividades);
  } catch (err) {
    console.error("Error al filtrar actividades:", err);
    res.status(500).json({ error: err.message });
  }
};
