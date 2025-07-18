import express from 'express';
import {
  obtenerRoles,
  crearRol,
  actualizarRol,
  eliminarRol,
  obtenerRolPorId,
} from '../controllers/rolController.js';

const rolRouter = express.Router();

// Rutas para roles
rolRouter.get('/', obtenerRoles);
rolRouter.get('/:id', obtenerRolPorId);
rolRouter.post('/', crearRol);
rolRouter.put('/:id', actualizarRol);
rolRouter.delete('/:id', eliminarRol);

export default rolRouter;