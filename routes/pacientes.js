import express from 'express';
import {
  crearPaciente,
  obtenerPacientes,
  obtenerPacientePorId,
  actualizarPaciente,
  eliminarPaciente,
  restaurarPaciente,
  obtenerPacientePorDNI
} from '../controllers/pacienteController.js';

const pacienteRouter = express.Router();

pacienteRouter.post('/', crearPaciente);
pacienteRouter.get('/', obtenerPacientes);
pacienteRouter.get('/:id', obtenerPacientePorId);
pacienteRouter.put('/:id', actualizarPaciente);
pacienteRouter.delete('/:id', eliminarPaciente);
pacienteRouter.post('/:id/restaurar', restaurarPaciente);
pacienteRouter.get('/dni/:dni', obtenerPacientePorDNI);


export default pacienteRouter;
