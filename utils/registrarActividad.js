import Actividad from "../models/Actividad.js";

export const registrarActividad = async (
  usuarioId,
  tipo,
  entidad,
  entidadId,
  descripcion,
  organizacionId
) => {
  try {
    await Actividad.create({
      usuarioId,
      tipo,
      entidad,
      entidadId,
      descripcion,
      organizacionId
    });
  } catch (error) {
    console.error("Error al registrar actividad:", error);
  }
};
