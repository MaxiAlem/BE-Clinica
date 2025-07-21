import express from 'express';
import usuarioRouter from './usuarios.js';
import profesionalRouter from './profesionales.js';
import pacienteRouter from './pacientes.js';
import turnoRouter from './turnos.js';
import obraSocialRouter from './obraSocial.js';
import especialidadRouter from './especialidades.js';
import metodoPagorouter from './metodosPago.js';
import rolRouter from './rol.js';
import { login,me } from '../controllers/authController.js';
import { verificarToken } from '../middleware/auth.js';
import diasLibreRouter from './diasLibre.js';

const router = express.Router();

// Rutas principales
router.get('/', (req, res) => {
  res.send('Bienvenido a la API');
});
router.post('/login', login);
router.get('/me',verificarToken, me);
// Usar rutas modulares
router.use('/profesionales',verificarToken, profesionalRouter);
router.use('/usuarios',verificarToken, usuarioRouter);

router.use('/metodos-pago', metodoPagorouter);

router.use('/pacientes', pacienteRouter);
router.use('/turnos', turnoRouter);
router.use('/obras-sociales', obraSocialRouter);
router.use('/especialidad', especialidadRouter);
router.use('/roles', rolRouter);
router.use('/dias-libres', diasLibreRouter);


export default router;  