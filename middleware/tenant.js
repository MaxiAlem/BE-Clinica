// middlewares/tenantMiddleware.js
import Organizacion from '../models/Organizacion.js';

export const tenantMiddleware = async (req, res, next) => {
  try {
    const slug = req.headers['x-tenant-slug']; // o parsear desde req.hostname
    if (!slug) return res.status(400).json({ error: 'Falta el tenant slug' });

    const organizacion = await Organizacion.findOne({ where: { slug } });
    if (!organizacion) return res.status(404).json({ error: 'Organización no encontrada' });

    req.organizacion = organizacion;
    req.organizacionId = organizacion.id;

    next();
  } catch (error) {
    console.error('Error en tenantMiddleware:', error);
    res.status(500).json({ error: 'Error al identificar organización' });
  }
};
