import ObraSocial from '../models/ObraSocial.js';

export const crearObraSocial = async (req, res) => {
  try {
    const { nombre } = req.body;
    const nuevaObraSocial = await ObraSocial.create({ nombre });
    res.status(201).json(nuevaObraSocial);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la obra social.', detalle: error.message });
  }
};

export const obtenerObrasSociales = async (req, res) => {
  try {
    const obrasSociales = await ObraSocial.findAll({
      order: [['nombre', 'ASC']],
    });
    res.json(obrasSociales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener obras sociales' });
  }
};
export const obtenerObraSocialPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const obraSocial = await ObraSocial.findByPk(id);
    if (!obraSocial) {
      return res.status(404).json({ error: 'Obra social no encontrada.' });
    }
    res.status(200).json(obraSocial);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar la obra social.', detalle: error.message });
  }
};

export const actualizarObraSocial = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    const obraSocial = await ObraSocial.findByPk(id);
    if (!obraSocial) {
      return res.status(404).json({ error: 'Obra social no encontrada.' });
    }

    obraSocial.nombre = nombre;
    await obraSocial.save();

    res.status(200).json(obraSocial);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la obra social.', detalle: error.message });
  }
};

export const eliminarObraSocial = async (req, res) => {
  try {
    const { id } = req.params;

    const obraSocial = await ObraSocial.findByPk(id);
    if (!obraSocial) {
      return res.status(404).json({ error: 'Obra social no encontrada.' });
    }

    await obraSocial.destroy(); // Soft delete gracias a `paranoid: true`

    res.status(200).json({ mensaje: 'Obra social eliminada correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la obra social.', detalle: error.message });
  }
};

