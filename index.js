import express from 'express';
import cors from 'cors';
import sequelize  from './models/index.js'; // ruta main de modelos
import routes from './routes/index.js'; // rutas duh

const app = express();
const PORT = process.env.PORT || 3000;
const URL = process.env.URL
// Middlewares

app.use(cors({
    origin: URL , // Reemplaza esto con la URL de tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization' // Encabezados permitidos
  }));
app.use(express.json());

// Rutas
app.use('/', routes);


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
