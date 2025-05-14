import sequelize from '../config/db.js';

// Importar los modelos directamente
import Usuario from './Usuario.js';
import Profesional from './Profesional.js';
import Disponibilidad from './Disponibilidad.js';

// Agrupar modelos para facilitar las asociaciones
const models = {
  Usuario,
  Profesional,
  Disponibilidad
};

// Ejecutar las asociaciones
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

// Sincronizar los modelos con la base de datos
const syncModels = async () => {
  try {
    // Sincronizamos todos los modelos
    await Disponibilidad.sync({ alter: false }); // O false si ya está todo bien

    console.log('Modelos sincronizados con la base de datos');
  } catch (error) {
    console.error('Error al sincronizar modelos con la base de datos:', error);
  }
};

syncModels();

export default sequelize;
export { models };
