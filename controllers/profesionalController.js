import sequelize from '../config/db.js'; 
import Profesional from '../models/Profesional.js';
import Disponibilidad from '../models/Disponibilidad.js';
import Especialidad from '../models/Especialidad.js'; 
import DiaLibre from '../models/DiasLibre.js';
import UsuarioProfesional from '../models/UsuarioProfesional.js';
import { Op } from 'sequelize';

/**
 * Crear un nuevo profesional
 */
export const crearProfesional = async (req, res) => {
  const { disponibilidad = [], especialidades = [], ...profesionalData } = req.body;
  try {
    const result = await sequelize.transaction(async (t) => {
      // Agregamos organizacionId
      const profesional = await Profesional.create(
        { ...profesionalData, organizacionId: req.organizacionId },
        { transaction: t }
      );

      // Disponibilidades
      if (disponibilidad.length > 0) {
        const disponibilidades = disponibilidad.map(d => ({
          ...d,
          profesionalId: profesional.id
        }));
        await Disponibilidad.bulkCreate(disponibilidades, { transaction: t });
      }

      // Especialidades
      if (especialidades && especialidades.length > 0) {
        await profesional.setEspecialidades(especialidades, { transaction: t });
      } else {
        await profesional.setEspecialidades([], { transaction: t });
      }

      const profesionalCompleto = await Profesional.findByPk(profesional.id, {
        include: [
          { model: Especialidad, as: 'especialidades', attributes: ['id', 'nombre'] },
          { model: Disponibilidad, as: 'disponibilidades' }
        ],
        transaction: t
      });

      return profesionalCompleto;
    });

    res.status(201).json(result);
  } catch (err) {
    console.error("Error en crearProfesional:", err);
    res.status(400).json({ error: err.message });
  }
};

/**
 * Obtener profesionales filtrando por rol y organizacion
 */
export const obtenerProfesionales = async (req, res) => {
  try {
    const hoy = new Date();
    const { id, rol } = req.user;

    let where = { organizacionId: req.organizacionId };

    if (rol === "profesional") {
      const asociaciones = await UsuarioProfesional.findAll({
        where: { usuarioId: id },
        attributes: ["profesionalId"],
      });
      const idsPermitidos = asociaciones.map(a => a.profesionalId);
      if (!idsPermitidos.length) return res.status(200).json([]);
      where.id = { [Op.in]: idsPermitidos };
    }

    const profesionales = await Profesional.findAll({
      where,
      include: [
        { 
          model: Especialidad, 
          as: "especialidades", 
          attributes: ["id", "nombre"],
          through: { attributes: [] },
        },
        { model: Disponibilidad, as: "disponibilidades" },
        {
          model: DiaLibre,
          as: "diasLibres",
          where: { fechaFin: { [Op.gte]: hoy } },
          required: false
        }
      ],
      order: [["apellido", "ASC"], ["nombre", "ASC"]]
    });

    res.status(200).json(profesionales);
  } catch (err) {
    console.error("Error en obtenerProfesionales:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Obtener un profesional por ID (o slug) y organizacion
 */
export const obtenerProfesionalPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const whereClause = isNaN(id)
      ? { slug: id, organizacionId: req.organizacionId }
      : { id: Number(id), organizacionId: req.organizacionId };

    const profesional = await Profesional.findOne({
      where: whereClause,
      include: [
        { model: Especialidad, as: 'especialidades', attributes: ['id', 'nombre'] },
        { model: Disponibilidad, as: 'disponibilidades' },
        { model: DiaLibre, as: 'diasLibres' }
      ]
    });

    if (!profesional) return res.status(404).json({ error: 'Profesional no encontrado' });
    res.json(profesional);
  } catch (err) {
    console.error("Error en obtenerProfesionalPorId:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Obtener disponibilidad de un profesional
 */
export const obtenerDisponibilidadProfesional = async (req, res) => {
  try {
    const disponibilidad = await Disponibilidad.findAll({
      where: { profesionalId: req.params.id }
    });
    res.json(disponibilidad);
  } catch (err) {
    console.error("Error en obtenerDisponibilidadProfesional:", err);
    res.status(500).json({ error: 'Error al obtener disponibilidad' });
  }
};

/**
 * Actualizar profesional
 */
export const actualizarProfesional = async (req, res) => {
  const { id } = req.params;
  const { disponibilidad = [], especialidades = [], ...profesionalData } = req.body;

  try {
    const result = await sequelize.transaction(async (t) => {
      const profesional = await Profesional.findOne({
        where: { id, organizacionId: req.organizacionId },
        transaction: t
      });
      if (!profesional) throw new Error('Profesional no encontrado');

      await profesional.update(profesionalData, { transaction: t });

      // Reemplazar disponibilidades
      await Disponibilidad.destroy({ where: { profesionalId: id }, transaction: t });
      if (disponibilidad.length > 0) {
        const disponibilidades = disponibilidad.map(d => ({ ...d, profesionalId: id }));
        await Disponibilidad.bulkCreate(disponibilidades, { transaction: t });
      }

      // Especialidades
      if (especialidades && especialidades.length > 0) {
        await profesional.setEspecialidades(especialidades, { transaction: t });
      } else {
        await profesional.setEspecialidades([], { transaction: t });
      }

      const profesionalActualizado = await Profesional.findByPk(id, {
        include: [
          { model: Especialidad, as: 'especialidades' },
          { model: Disponibilidad, as: 'disponibilidades' }
        ],
        transaction: t
      });

      return profesionalActualizado;
    });

    res.json(result);
  } catch (err) {
    console.error("Error en actualizarProfesional:", err);
    res.status(400).json({ error: err.message });
  }
};

/**
 * Eliminar profesional (soft-delete)
 */
export const eliminarProfesional = async (req, res) => {
  try {
    const profesional = await Profesional.findOne({
      where: { id: req.params.id, organizacionId: req.organizacionId }
    });
    if (!profesional) return res.status(404).json({ error: 'Profesional no encontrado' });

    await profesional.destroy();
    res.json({ message: 'Profesional eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Restaurar profesional
 */
export const restaurarProfesional = async (req, res) => {
  try {
    const profesional = await Profesional.findOne({
      where: { id: req.params.id, organizacionId: req.organizacionId },
      paranoid: false
    });
    if (!profesional) return res.status(404).json({ error: 'Profesional no encontrado' });

    await profesional.restore();
    res.json({ message: 'Profesional restaurado', profesional });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
