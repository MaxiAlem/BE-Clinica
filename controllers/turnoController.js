import Turno from '../models/Turno.js';
import Paciente from '../models/Paciente.js';
import Profesional from '../models/Profesional.js';
import Especialidad from '../models/Especialidad.js';

/**
 * Crear un nuevo turno
 */
export const crearTurno = async (req, res) => {
  try {
    const turno = await Turno.create(req.body);
    res.status(201).json(turno);
  } catch (err) {
    console.error("Error en crearTurno:", err);
    res.status(400).json({ error: err.message });
  }
};

/**
 * Obtener todos los turnos
 */
export const obtenerTurnos = async (req, res) => {
  try {
    const turnos = await Turno.findAll({
      include: [{
        model: Paciente,
        as: 'Paciente'  // IMPORTANTE usar el alias aquí
      },{
        model: Profesional,
        as: 'Profesional'  // IMPORTANTE usar el alias aquí
      },]
    });
    res.json(turnos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Obtener un turno por ID
 */
export const obtenerTurnoPorId = async (req, res) => {
  try {
    const turno = await Turno.findByPk(req.params.id, {
      include: [
        { model: Paciente, as: 'Paciente' },
        { model: Profesional, as: 'Profesional' }
      ]
    });
    

    if (!turno) {
      return res.status(404).json({ error: 'Turno no encontrado' });
    }

    res.json(turno);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Obtener turnos por paciente ID
 */
export const obtenerTurnosPorPaciente = async (req, res) => {
  try {
    const { pacienteId } = req.params;
    const turnos = await Turno.findAll({
      where: { pacienteId },
      include: [
        { 
          model: Profesional,
          as: 'Profesional',
          include: [{
            model: Especialidad,
            as: 'especialidad',
            attributes: ['id', 'nombre'] // Solo traemos estos campos
          }]
        }
      ],
    });
    res.json(turnos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Obtener turnos por profesional ID
 */
 export const obtenerTurnosPorProfesional = async (req, res) => {
  try {
    const { profesionalId } = req.params;
    const turnos = await Turno.findAll({
      where: { profesionalId },
      include: [
        {
          model: Paciente,
          as: 'Paciente'  
        }
      ]
    });
    res.json(turnos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Obtener turnos por día (rango desde 00:00 hasta 23:59)
 */
export const obtenerTurnosPorDia = async (req, res) => {
  try {
    const { fecha } = req.query; // formato esperado: YYYY-MM-DD

    if (!fecha) {
      return res.status(400).json({ error: 'Se requiere una fecha en query param' });
    }

    const startOfDay = new Date(`${fecha}T00:00:00`);
    const endOfDay = new Date(`${fecha}T23:59:59`);

    const turnos = await Turno.findAll({
      where: {
        fechaHora: {
          [Op.between]: [startOfDay, endOfDay]
        }
      },
      include: [Paciente, Profesional]
    });

    res.json(turnos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Actualizar un turno
 */
export const actualizarTurno = async (req, res) => {
  try {
    const turno = await Turno.findByPk(req.params.id);
    if (!turno) {
      return res.status(404).json({ error: 'Turno no encontrado' });
    }

    await turno.update(req.body);
    res.json(turno);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Eliminar (soft-delete) un turno
 */
export const eliminarTurno = async (req, res) => {
  try {
    const turno = await Turno.findByPk(req.params.id);
    if (!turno) {
      return res.status(404).json({ error: 'Turno no encontrado' });
    }

    await turno.destroy();
    res.json({ message: 'Turno eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Restaurar un turno eliminado
 */
export const restaurarTurno = async (req, res) => {
  try {
    const turno = await Turno.findByPk(req.params.id, { paranoid: false });
    if (!turno) {
      return res.status(404).json({ error: 'Turno no encontrado' });
    }

    await turno.restore();
    res.json({ message: 'Turno restaurado', turno });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
