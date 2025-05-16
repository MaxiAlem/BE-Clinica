import Paciente from '../models/Paciente.js';
import { models } from '../models/index.js';

/**
 * Crear un nuevo paciente
 */
export const crearPaciente = async (req, res) => {
  try {
    const paciente = await Paciente.create(req.body);
    res.status(201).json(paciente);
  } catch (err) {
    console.error("Error en crearPaciente:", err);
    res.status(400).json({ error: err.message });
  }
};

/**
 * Obtener todos los pacientes
 */
export const obtenerPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.findAll();
    res.status(200).json(pacientes);
  } catch (err) {
    console.error("Error en obtenerPacientes:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Obtener un paciente por ID
 */
export const obtenerPacientePorId = async (req, res) => {
  try {
    const { id } = req.params;

    const paciente = await Paciente.findByPk(id);
    if (!paciente) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    res.json(paciente);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Obtener un paciente por dni
 */
export const obtenerPacientePorDNI = async (req, res) => {
  try {
    const { dni } = req.params;
    console.log("DNI recibido:", dni);

    const pacientes = await Paciente.findAll();
    console.log("Pacientes en DB:", pacientes.map(p => p.dni));
    const paciente = await Paciente.findOne({ where: { dni: Number(dni) } });
    if (!paciente) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    res.json(paciente);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Actualizar un paciente
 */
export const actualizarPaciente = async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id);
    if (!paciente) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    await paciente.update(req.body);
    res.json(paciente);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Eliminar (soft-delete) un paciente
 */
export const eliminarPaciente = async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id);
    if (!paciente) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    await paciente.destroy();
    res.json({ message: 'Paciente eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Restaurar un paciente eliminado
 */
export const restaurarPaciente = async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id, { paranoid: false });
    if (!paciente) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    await paciente.restore();
    res.json({ message: 'Paciente restaurado', paciente });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
