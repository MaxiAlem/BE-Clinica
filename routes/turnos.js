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
  obtenerTurnosPorDia,
  obtenerTurnosPorProfesionalYDia,
  generarAgendaPDFPorProfesionalYDia
} from '../controllers/turnoController.js';

const turnoRouter = express.Router();

// Filtros primero

turnoRouter.get('/fecha/dia', obtenerTurnosPorDia); // ?fecha=YYYY-MM-DD
turnoRouter.get('/profesional/:profesionalId/turnos-dia', obtenerTurnosPorProfesionalYDia);
turnoRouter.get('/profesional/:profesionalId/dia/pdf', generarAgendaPDFPorProfesionalYDia);
turnoRouter.get('/paciente/:pacienteId', obtenerTurnosPorPaciente);
turnoRouter.get('/profesional/:profesionalId', obtenerTurnosPorProfesional);
// CRUD
turnoRouter.post('/', crearTurno);
turnoRouter.get('/', obtenerTurnos);
turnoRouter.get('/:id', obtenerTurnoPorId);
turnoRouter.put('/:id', actualizarTurno);
turnoRouter.delete('/:id', eliminarTurno);
turnoRouter.post('/:id/restaurar', restaurarTurno);


export default turnoRouter;
