import { Router } from 'express';
import {
  crearProfesional,
  obtenerProfesionales,
  obtenerProfesionalPorId,
  actualizarProfesional,
  eliminarProfesional,
  restaurarProfesional,
  obtenerDisponibilidadProfesional
} from '../controllers/profesionalController.js';
import { verificarToken } from '../middleware/auth.js';
import autorizarRol from '../middleware/autorizarRol.js';
import Disponibilidad from '../models/Disponibilidad.js';

const profesionalRouter = Router();

profesionalRouter.post('/', crearProfesional);
profesionalRouter.get('/', verificarToken,obtenerProfesionales);
profesionalRouter.get('/:id', obtenerProfesionalPorId);
profesionalRouter.put('/:id', actualizarProfesional);
profesionalRouter.delete('/:id', eliminarProfesional);
profesionalRouter.post('/:id/restaurar', restaurarProfesional);

// Ruta específica para obtener disponibilidad
// Ruta de disponibilidad
profesionalRouter.get('/:id/disponibilidad',  
  obtenerDisponibilidadProfesional
);

export default profesionalRouter;
