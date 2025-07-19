import DiaLibre from '../models/DiasLibre.js';
import { Op } from 'sequelize';


// CREAR DIAS LIBRES 
export const crearDiaLibre = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, motivo, profesionalId } = req.body;
    // ------------ Validación para que estén todos los campos -------------
    if (!fechaInicio || !fechaFin || !profesionalId) {
      return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    // ------------ Validación de fechas, no debería poder reservar hoy y terminar el dia libre ayer -------------

    if (inicio > fin) {
      return res.status(400).json({ error: 'La fecha de inicio no puede ser posterior a la fecha de fin.' });
    }
    // ------------ Validación de fecha de inicio, no debería poder reservar para ayer -------------
    if (inicio < hoy) {
      return res.status(400).json({ error: 'No se puede crear un día libre en el pasado.' });
    }

    const nuevoDiaLibre = await DiaLibre.create({
      fechaInicio,
      fechaFin,
      motivo,
      profesionalId
    });

    return res.status(201).json(nuevoDiaLibre);
  } catch (error) {
    console.error('Error al crear día libre:', error);
    res.status(500).json({ error: 'Error del servidor.' });
  }
};


// OBTENER DIAS LIBRES
export const getTodosDiasLibres = async (req, res) => {
  try {
    const { profesionalId, desde, hasta, soloFuturos } = req.query;

    const where = {};

    // ----------- Filtro por profesional si se pasa por query -----------
    if (profesionalId) {
      where.profesionalId = profesionalId;
    }

    //------------ Filtro por rango de fechas (opcional) --------------
    if (desde && hasta) {
      where.fechaInicio = { [Op.lte]: hasta };
      where.fechaFin = { [Op.gte]: desde };
    }

    //------------ Mostrar solo días futuros -------------
    if (soloFuturos === 'true') {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      where.fechaFin = { ...(where.fechaFin || {}), [Op.gte]: hoy };
    }

    const diasLibres = await DiaLibre.findAll({
      where,
      order: [['fechaInicio', 'ASC']]
    });

    res.json(diasLibres);
  } catch (error) {
    console.error('Error al obtener días libres:', error);
    res.status(500).json({ error: 'Error al obtener días libres.' });
  }
};

// ELIMINAR DIA LIBRE
export const eliminarDiaLibre = async (req, res) => {
  try {
    const { id } = req.params;

    const diaLibre = await DiaLibre.findByPk(id);

    if (!diaLibre) {
      return res.status(404).json({ error: 'Día libre no encontrado.' });
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // Evitar eliminar si ya pasó
    if (new Date(diaLibre.fechaFin) < hoy) {
      return res.status(400).json({ error: 'No se puede eliminar un día libre que ya pasó.' });
    }

    await diaLibre.destroy(); // soft delete gracias a paranoid: true

    res.json({ mensaje: 'Día libre eliminado correctamente.' });
  } catch (err) {
    console.error('Error al eliminar día libre:', err);
    res.status(500).json({ error: 'Error del servidor.' });
  }


};


// ACTUALIZAR DIA LIBRE
export const actualizarDiaLibre = async (req, res) => {
  try {
    const { id } = req.params;
    const { fechaInicio, fechaFin, motivo } = req.body;

    const diaLibre = await DiaLibre.findByPk(id);

    if (!diaLibre) {
      return res.status(404).json({ error: 'Día libre no encontrado.' });
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // No permitir editar fechas pasadas
    if (new Date(diaLibre.fechaFin) < hoy) {
      return res.status(400).json({ error: 'No se puede editar un día libre que ya pasó.' });
    }

    // Validar fechas
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    if (inicio > fin) {
      return res.status(400).json({ error: 'La fecha de inicio no puede ser posterior a la de fin.' });
    }

    await diaLibre.update({ fechaInicio, fechaFin, motivo });

    res.json({ mensaje: 'Día libre actualizado correctamente.', diaLibre });
  } catch (err) {
    console.error('Error al actualizar día libre:', err);
    res.status(500).json({ error: 'Error del servidor.' });
  }
};