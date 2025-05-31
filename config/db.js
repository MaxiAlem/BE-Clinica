import {Sequelize} from 'sequelize'
import dotenv from 'dotenv';


dotenv.config();

const USER_DB = process.env.USER_DB 
const PW_DB = process.env.PW_DB  
const NAME_DB = process.env.NAME_DB 
const HOST_DB = process.env.HOST_DB 
const PORT_DB = process.env.PORT_DB



const sequelize = new Sequelize(NAME_DB, USER_DB, PW_DB, {
  host: HOST_DB,
  dialect:'mysql',
  port: PORT_DB
});

// Función para probar la conexión a la base de datos
async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
  } catch (error) {
    console.error('Error al conectar con la base de datos:',error);
  }
}

// (async () => {
//   try {
//     await sequelize.sync({ force: true }); // Asegúrate de que force: true solo se usa en desarrollo
//     console.log('Modelos sincronizados con la base de datos');
//   } catch (error) {
//     console.error('Error al sincronizar modelos con la base de datos:', error);
//   }
// })();


// Invoca la prueba de conexión
testDatabaseConnection();
try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}



export default sequelize;