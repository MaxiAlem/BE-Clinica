import express from 'express';
import usuarioRouter from './usuarios.js';
import profesionalRouter from './profesionales.js';
import pacienteRouter from './pacientes.js';
import turnoRouter from './turnos.js';
import obraSocialRouter from './obraSocial.js';
import especialidadRouter from './especialidades.js';
import metodoPagorouter from './metodosPago.js';
import rolRouter from './rol.js';
import facturacionRouter from './facturacion.js';
import actividadRouter from './actividad.js';
import { login,me } from '../controllers/authController.js';
import { verificarToken } from '../middleware/auth.js';
import { tenantMiddleware } from '../middleware/tenant.js';
import diasLibreRouter from './diasLibre.js';
import statRouter from './stats.js';

const router = express.Router();

// Rutas principales
router.get('/', (req, res) => {
  res.send('Bienvenido a la API');
});
router.post('/login', login);
router.get('/me',verificarToken, me);
// Usar rutas modulares
router.use('/profesionales',verificarToken, profesionalRouter);
router.use('/stats',verificarToken,statRouter);
router.use('/facturas',verificarToken,facturacionRouter);
router.use('/usuarios', verificarToken,usuarioRouter);

router.use("/logs",verificarToken, actividadRouter);

router.use('/metodos-pago',verificarToken, metodoPagorouter);

router.use('/pacientes',verificarToken, pacienteRouter);
router.use('/turnos', verificarToken,turnoRouter);
router.use('/obras-sociales', verificarToken,obraSocialRouter);
router.use('/especialidad', verificarToken,especialidadRouter);
router.use('/roles',verificarToken, rolRouter);
router.use('/dias-libres',verificarToken, diasLibreRouter);


export default router;  