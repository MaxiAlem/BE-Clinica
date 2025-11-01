


import express from 'express';
import {
    getPacientesPorEspecialidad,
    getPacientesPorMes,
    getPacientesPorProfesional,
    getPorcentajeCancelados,
    getTendenciaTurnos,
    getTopObrasSociales,
    getPacientesPorObraSocialYProfesional

} from '../controllers/statsController.js';

const statRouter = express.Router();

// Rutas para roles
statRouter.get('/pacientes-por-especialidad', getPacientesPorEspecialidad);
statRouter.get('/pacientes-por-profesional', getPacientesPorProfesional);
statRouter.get('/top-obras-sociales', getTopObrasSociales);
statRouter.get('/tendencia-turnos', getTendenciaTurnos);
statRouter.get('/tendencia-pacientes-nuevos', getPacientesPorMes);
statRouter.get('/porcentaje-cancelados', getPorcentajeCancelados);
statRouter.get('/pacientes-obra-social-profesional', getPacientesPorObraSocialYProfesional);

export default statRouter;