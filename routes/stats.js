


import express from 'express';
import {
    getPacientesPorEspecialidad,
    getPacientesPorProfesional,
    getTopObrasSociales

} from '../controllers/statsController.js';

const statRouter = express.Router();

// Rutas para roles
statRouter.get('/pacientes-por-especialidad', getPacientesPorEspecialidad);
statRouter.get('/pacientes-por-profesional', getPacientesPorProfesional);
statRouter.get('/top-obras-sociales', getTopObrasSociales);

export default statRouter;