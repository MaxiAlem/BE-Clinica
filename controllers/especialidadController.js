// controllers/especialidadController.js
import Especialidad from '../models/Especialidad.js';

/**
 * Crear una nueva especialidad
 */
export const crearEspecialidad = async (req, res) => {
  try {
    const { nombre } = req.body;

    // Validación
    if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });

    // Crear
    const especialidad = await Especialidad.create({ nombre });
    res.status(201).json(especialidad);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Esta especialidad ya existe' });
    }
    res.status(500).json({ error: 'Error al crear especialidad', detalle: error.message });
  }
};

/**
 * Obtener todas las especialidades
 */
export const obtenerEspecialidades = async (req, res) => {
  try {
    const especialidades = await Especialidad.findAll({
      order: [['nombre', 'ASC']] // Orden alfabético
    });
    res.json(especialidades);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener especialidades', detalle: error.message });
  }
};

/**
 * Obtener una especialidad por ID
 */
export const obtenerEspecialidadPorId = async (req, res) => {
  try {
    const especialidad = await Especialidad.findByPk(req.params.id);
    if (!especialidad) return res.status(404).json({ error: 'Especialidad no encontrada' });
    res.json(especialidad);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar especialidad', detalle: error.message });
  }
};

/**
 * Actualizar una especialidad
 */
export const actualizarEspecialidad = async (req, res) => {
  try {
    const { nombre } = req.body;

    const especialidad = await Especialidad.findByPk(req.params.id);
    if (!especialidad) return res.status(404).json({ error: 'Especialidad no encontrada' });

    // Solo actualizar campos permitidos
    if (nombre) especialidad.nombre = nombre;

    await especialidad.save();
    res.json(especialidad);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Esta especialidad ya existe' });
    }
    res.status(500).json({ error: 'Error al actualizar especialidad', detalle: error.message });
  }
};

/**
 * Eliminar (soft delete) una especialidad
 */
export const eliminarEspecialidad = async (req, res) => {
  try {
    const especialidad = await Especialidad.findByPk(req.params.id);
    if (!especialidad) return res.status(404).json({ error: 'Especialidad no encontrada' });

    await especialidad.destroy(); // soft delete
    res.json({ mensaje: 'Especialidad eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar especialidad', detalle: error.message });
  }
};
