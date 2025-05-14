
import Profesional from '../models/Profesional.js';
import Disponibilidad from '../models/Disponibilidad.js';
import { models } from '../models/index.js';//para meter los includes 
/**
 * Crear un nuevo profesional
 */
 export const crearProfesional = async (req, res) => {
    const { disponibilidad, ...restoDatos } = req.body;
  
    try {
      // 1. Crear el profesional
      const profesional = await Profesional.create(restoDatos);
  
      // 2. Crear las disponibilidades si existen
      if (Array.isArray(disponibilidad) && disponibilidad.length > 0) {
        const disponibilidadesConId = disponibilidad.map(d => ({
          ...d,
          profesionalId: profesional.id,
        }));
  
        await Disponibilidad.bulkCreate(disponibilidadesConId);
      }
  
      res.status(201).json(profesional);
    } catch (err) {
      console.error("Error en crearProfesional:", err);
      res.status(400).json({ error: err.message });
    }
  };


//obtener profesionales
export const obtenerProfesionales = async (req, res) => {
    try {
      const profesionales = await Profesional.findAll({
        include: {
            model: models.Disponibilidad,
            as: 'disponibilidades'
          }
      });
      res.status(200).json(profesionales);
    } catch (err) {
        console.error("Error en obtenerprofesioanes:", err);
      res.status(500).json({ error: err.message });
    }
  };
  
/**
 * Obtener un profesional por ID
 */
 export const obtenerProfesionalPorId = async (req, res) => {
    try {
      const { id } = req.params;
  
      const whereClause = isNaN(id)
        ? { slug: id } // si no es número → buscar por slug
        : { id: Number(id) }; // si es número → buscar por id
  
      const profesional = await Profesional.findOne({ where: whereClause });
  
      if (!profesional) {
        return res.status(404).json({ error: 'Profesional no encontrado' });
      }
  
      res.json(profesional);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

/**
 * Actualizar un profesional
 */
export const actualizarProfesional = async (req, res) => {
  try {
    const profesional = await Profesional.findByPk(req.params.id);
    if (!profesional) {
      return res.status(404).json({ error: 'Profesional no encontrado' });
    }

    await profesional.update(req.body);
    res.json(profesional);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Eliminar (soft-delete) un profesional
 */
export const eliminarProfesional = async (req, res) => {
  try {
    const profesional = await Profesional.findByPk(req.params.id);
    if (!profesional) {
      return res.status(404).json({ error: 'Profesional no encontrado' });
    }

    await profesional.destroy();
    res.json({ message: 'Profesional eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Restaurar un profesional eliminado
 */
export const restaurarProfesional = async (req, res) => {
  try {
    const profesional = await Profesional.findByPk(req.params.id, { paranoid: false });
    if (!profesional) {
      return res.status(404).json({ error: 'Profesional no encontrado' });
    }

    await profesional.restore();
    res.json({ message: 'Profesional restaurado', profesional });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
