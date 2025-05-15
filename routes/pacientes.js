import express from 'express';
import {
  crearPaciente,
  obtenerPacientes,
  obtenerPacientePorId,
  actualizarPaciente,
  eliminarPaciente,
  restaurarPaciente
} from '../controllers/pacienteController.js';

const pacienteRouter = express.Router();

pacienteRouter.post('/', crearPaciente);
pacienteRouter.get('/', obtenerPacientes);
pacienteRouter.get('/:id', obtenerPacientePorId);
pacienteRouter.put('/:id', actualizarPaciente);
pacienteRouter.delete('/:id', eliminarPaciente);
pacienteRouter.post('/:id/restaurar', restaurarPaciente);

export default pacienteRouter;
