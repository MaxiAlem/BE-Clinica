import { Router } from 'express';
import {
  crearProfesional,
  obtenerProfesionales,
  obtenerProfesionalPorId,
  actualizarProfesional,
  eliminarProfesional,
  restaurarProfesional
} from '../controllers/profesionalController.js';
import { verificarToken } from '../middleware/auth.js';
import autorizarRol from '../middleware/autorizarRol.js';

const profesionalRouter = Router();

profesionalRouter.post('/', crearProfesional);
profesionalRouter.get('/', verificarToken,obtenerProfesionales);
profesionalRouter.get('/:id', obtenerProfesionalPorId);
profesionalRouter.put('/:id', actualizarProfesional);
profesionalRouter.delete('/:id', eliminarProfesional);
profesionalRouter.post('/:id/restaurar', restaurarProfesional);

export default profesionalRouter;
