import Paciente from '../models/Paciente.js';
import ObraSocial from '../models/ObraSocial.js';
import { Op } from 'sequelize';

/**
 * Crear un nuevo paciente
 */
export const crearPaciente = async (req, res) => {
  try {
    const paciente = await Paciente.create({
      ...req.body,
      organizacionId: req.organizacionId
    });
    res.status(201).json(paciente);
  } catch (err) {
    console.error("Error en crearPaciente:", err);
    res.status(400).json({ error: err.message });
  }
};

/**
 * Obtener todos los pacientes de la organización
 */
export const obtenerPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.findAll({
      where: { organizacionId: req.organizacionId },
      include: { model: ObraSocial, as: 'obraSocial' },
      order: [['apellido', 'ASC'], ['nombre', 'ASC']]
    });
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
    const paciente = await Paciente.findOne({
      where: { id: req.params.id, organizacionId: req.organizacionId },
      include: { model: ObraSocial, as: 'obraSocial' }
    });
    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });
    res.json(paciente);
  } catch (err) {
    console.error("Error en obtenerPacientePorId:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Obtener un paciente por DNI
 */
export const obtenerPacientePorDNI = async (req, res) => {
  try {
    const { dni } = req.params;

    const paciente = await Paciente.findOne({
      where: { dni: Number(dni), organizacionId: req.organizacionId },
      include: { model: ObraSocial, as: 'obraSocial' }
    });
    
    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });
    res.json(paciente);
  } catch (err) {
    console.error("Error en obtenerPacientePorDNI:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Actualizar un paciente
 */
export const actualizarPaciente = async (req, res) => {
  try {
    const paciente = await Paciente.findOne({
      where: { id: req.params.id, organizacionId: req.organizacionId }
    });
    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });

    await paciente.update(req.body);
    res.json(paciente);
  } catch (err) {
    console.error("Error en actualizarPaciente:", err);
    res.status(400).json({ error: err.message });
  }
};

/**
 * Eliminar (soft-delete) un paciente
 */
export const eliminarPaciente = async (req, res) => {
  try {
    const paciente = await Paciente.findOne({
      where: { id: req.params.id, organizacionId: req.organizacionId }
    });
    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });

    await paciente.destroy();
    res.json({ message: 'Paciente eliminado' });
  } catch (err) {
    console.error("Error en eliminarPaciente:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Restaurar un paciente eliminado
 */
export const restaurarPaciente = async (req, res) => {
  try {
    const paciente = await Paciente.findOne({
      where: { id: req.params.id, organizacionId: req.organizacionId },
      paranoid: false
    });
    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });

    await paciente.restore();
    res.json({ message: 'Paciente restaurado', paciente });
  } catch (err) {
    console.error("Error en restaurarPaciente:", err);
    res.status(500).json({ error: err.message });
  }
};
