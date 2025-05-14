import { Router } from 'express';
import {
  crearProfesional,
  obtenerProfesionales,
  obtenerProfesionalPorId,
  actualizarProfesional,
  eliminarProfesional,
  restaurarProfesional
} from '../controllers/profesionalController.js';

const profesionalRouter = Router();

profesionalRouter.post('/', crearProfesional);
profesionalRouter.get('/', obtenerProfesionales);
profesionalRouter.get('/:id', obtenerProfesionalPorId);
profesionalRouter.put('/:id', actualizarProfesional);
profesionalRouter.delete('/:id', eliminarProfesional);
profesionalRouter.post('/:id/restaurar', restaurarProfesional);

export default profesionalRouter;
