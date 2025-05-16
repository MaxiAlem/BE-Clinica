import express from 'express';
import cors from 'cors';
import sequelize  from './models/index.js'; // ruta main de modelos
import routes from './routes/index.js'; // rutas duh

const app = express();
const PORT = process.env.PORT || 3000;
const URL = process.env.URL
// Middlewares

// app.use(cors({
//     origin: URL , // Reemplaza esto con la URL de tu frontend
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     allowedHeaders: 'Content-Type, Authorization' // Encabezados permitidos
//   }));
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://clinicatrinidad.org',
    'https://www.clinicatrinidad.org'
  ];
  
  app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  }));
app.use(express.json());

// Rutas
//app.use('/api', routes);// para local
app.use('/', routes); //para servidor


app.listen(PORT, async () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  
  // Test de conexión con la base de datos
  try {
    await sequelize.authenticate();
    console.log('Conexión con la base de datos establecida con éxito.');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos :', error);
  }
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('SIGINT', () => {
  console.log('Proceso recibido SIGINT (Ctrl+C o kill). Cerrando...');
  process.exit(0);
});

process.on('exit', (code) => {
  console.log(`Proceso terminado con código: ${code}`);
});


