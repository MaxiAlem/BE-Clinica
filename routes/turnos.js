import express from 'express';
import {
  crearTurno,
  obtenerTurnos,
  obtenerTurnoPorId,
  actualizarTurno,
  eliminarTurno,
  restaurarTurno,
  obtenerTurnosPorPaciente,
  obtenerTurnosPorProfesional,
  obtenerTurnosPorDia
} from '../controllers/turnoController.js';

const turnoRouter = express.Router();

// CRUD principal
turnoRouter.post('/', crearTurno);
turnoRouter.get('/', obtenerTurnos); // todos los turnos  
turnoRouter.get('/:id', obtenerTurnoPorId);
turnoRouter.put('/:id', actualizarTurno);
turnoRouter.delete('/:id', eliminarTurno);
turnoRouter.post('/:id/restaurar', restaurarTurno);

// Filtrados
turnoRouter.get('/paciente/:pacienteId', obtenerTurnosPorPaciente);
turnoRouter.get('/profesional/:profesionalId', obtenerTurnosPorProfesional);
turnoRouter.get('/fecha/dia', obtenerTurnosPorDia); // requiere ?fecha=YYYY-MM-DD

export default turnoRouter;
