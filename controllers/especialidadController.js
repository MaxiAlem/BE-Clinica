// controllers/especialidadController.js
import Especialidad from '../models/Especialidad.js';

export const crearEspecialidad = async (req, res) => {
  try {
    const { nombre } = req.body;
    const especialidad = await Especialidad.create({ nombre });
    res.status(201).json(especialidad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerEspecialidades = async (req, res) => {
  try {
    const especialidades = await Especialidad.findAll();
    res.json(especialidades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerEspecialidadPorId = async (req, res) => {
  try {
    const especialidad = await Especialidad.findByPk(req.params.id);
    if (!especialidad) return res.status(404).json({ mensaje: 'No encontrada' });
    res.json(especialidad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const actualizarEspecialidad = async (req, res) => {
  try {
    const especialidad = await Especialidad.findByPk(req.params.id);
    if (!especialidad) return res.status(404).json({ mensaje: 'No encontrada' });
    await especialidad.update(req.body);
    res.json(especialidad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminarEspecialidad = async (req, res) => {
  try {
    const especialidad = await Especialidad.findByPk(req.params.id);
    if (!especialidad) return res.status(404).json({ mensaje: 'No encontrada' });
    await especialidad.destroy();
    res.json({ mensaje: 'Eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
