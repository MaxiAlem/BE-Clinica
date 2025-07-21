
  import  sequelize  from '../config/db.js'; 
  import Profesional from '../models/Profesional.js';
  import Disponibilidad from '../models/Disponibilidad.js';
  import Especialidad from '../models/Especialidad.js'; 
  import DiaLibre from '../models/DiasLibre.js';
  import UsuarioProfesional from '../models/UsuarioProfesional.js';
  import { models } from '../models/index.js';//para meter los includes 
  import { Op } from 'sequelize'; // Asegurate de importar Op
  /**
   * Crear un nuevo profesional
   */
  export const crearProfesional = async (req, res) => {
    const { disponibilidad = [], especialidades = [], ...profesionalData } = req.body;


    try {
      // Iniciar transacción
      const result = await sequelize.transaction(async (t) => {
        // 1. Crear el profesional
        const profesional = await Profesional.create(profesionalData, { transaction: t });

        // 2. Crear disponibilidades si existen
        if (disponibilidad.length > 0) {
          const disponibilidades = disponibilidad.map(d => ({
            ...d,
            profesionalId: profesional.id
          }));
          await Disponibilidad.bulkCreate(disponibilidades, { transaction: t });
        }

       // En crearProfesional y actualizarProfesional
if (especialidades && especialidades.length > 0) {
  await profesional.setEspecialidades(especialidades, { transaction: t });
} else {
  // Limpiar especialidades si no se proporcionan
  await profesional.setEspecialidades([], { transaction: t });
}
        // 3. Obtener el profesional con sus relaciones
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

 // obtenerProfesionales filtrando por rol de usuario
 export const obtenerProfesionales = async (req, res) => {
  try {
    const hoy = new Date();
    const { id, rol } = req.user;
    let where = {};

    if (rol === "profesional") {
      // Buscar los IDs de profesionales asociados a este usuario
      const asociaciones = await UsuarioProfesional.findAll({
        where: { usuarioId: id },
        attributes: ["profesionalId"],
      });
      const idsPermitidos = asociaciones.map(a => a.profesionalId);

      // Si no tiene ninguno asociado, devolvé vacío
      if (!idsPermitidos.length) {
        return res.status(200).json([]);
      }

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
        { 
          model: Disponibilidad, 
          as: "disponibilidades"
        },
        {
          model: DiaLibre,
          as: "diasLibres",
          where: {
            fechaFin: { [Op.gte]: hoy }
          },
          required: false
        }
      ],
      order: [
        ["apellido", "ASC"],
        ["nombre", "ASC"]
      ]
    });

    res.status(200).json(profesionales);
  } catch (err) {
    console.error("Error en obtenerProfesionales:", err);
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
        ? { slug: id }
        : { id: Number(id) };
  
      const profesional = await Profesional.findOne({
        where: whereClause,
        include: [
          { model: Especialidad, as: 'especialidades', attributes: ['id', 'nombre'] },
          { model: Disponibilidad, as: 'disponibilidades' },
          { model: DiaLibre, as: 'diasLibres' } // Trae todos
        ]
      });
  
      if (!profesional) {
        return res.status(404).json({ error: 'Profesional no encontrado' });
      }
  
      res.json(profesional);
    } catch (err) {
      console.error("Error en obtenerProfesionalPorId:", err);
      res.status(500).json({ error: err.message });
    }
  };
    
  // 
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
   * Actualizar un profesional
   */
  export const actualizarProfesional = async (req, res) => {
    const { id } = req.params;
    const { disponibilidad = [], especialidades = [], ...profesionalData } = req.body;

    try {
      // Iniciar transacción
      const result = await sequelize.transaction(async (t) => {
        // 1. Actualizar datos del profesional
        const profesional = await Profesional.findByPk(id, { transaction: t });
        if (!profesional) {
          throw new Error('Profesional no encontrado');
        }

        await profesional.update(profesionalData, { transaction: t });

        // 2. Eliminar disponibilidades existentes
        await Disponibilidad.destroy({
          where: { profesionalId: id },
          transaction: t
        });

        // 3. Crear nuevas disponibilidades
        if (disponibilidad.length > 0) {
          const disponibilidades = disponibilidad.map(d => ({
            ...d,
            profesionalId: id
          }));
          await Disponibilidad.bulkCreate(disponibilidades, { transaction: t });
        }
                // En crearProfesional y actualizarProfesional
        if (especialidades && especialidades.length > 0) {
          await profesional.setEspecialidades(especialidades, { transaction: t });
        } else {
          // Limpiar especialidades si no se proporcionan
          await profesional.setEspecialidades([], { transaction: t });
        }
        // 4. Obtener el profesional actualizado con relaciones
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
