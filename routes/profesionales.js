import { Router } from 'express';
import { permitirRoles } from '../middleware/roles.js';
import { verificarToken } from '../middleware/auth.js';

import {
  crearProfesional,
  obtenerProfesionales,
  obtenerProfesionalPorId,
  actualizarProfesional,
  eliminarProfesional,
  restaurarProfesional
} from '../controllers/profesionalController.js';

const profesionalRouter = Router();

profesionalRouter.post('/',verificarToken, permitirRoles('admin'), crearProfesional);
profesionalRouter.get('/', verificarToken, permitirRoles('admin'), obtenerProfesionales);
profesionalRouter.get('/:id', obtenerProfesionalPorId);
profesionalRouter.put('/:id', actualizarProfesional);
profesionalRouter.delete('/:id', eliminarProfesional);
profesionalRouter.post('/:id/restaurar', restaurarProfesional);

export default profesionalRouter;
