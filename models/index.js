import sequelize from '../config/db.js';

// Importar los modelos directamente
import Usuario from './Usuario.js';
import Profesional from './Profesional.js';
import Disponibilidad from './Disponibilidad.js';
import Turno from './Turno.js';
import Paciente from './Paciente.js';
import ObraSocial from './ObraSocial.js';
import Especialidad from './Especialidad.js';
import Rol from './Role.js';
import MetodoPago from './MetodoPago.js';

//import seedObrasSociales from '../seeders/22052025-obras-sociales.js';
//import seedEspecialidades from '../seeders/22052025-especialidades.js';
//import generarRolesBase from '../seeders/initRoles.js';
import genmetodosPago from '../seeders/seedMetodosPago.js';
// Agrupar modelos para facilitar las asociaciones
const models = {
  Usuario,
  Profesional,
  Disponibilidad,
  Turno,
  Paciente,
  ObraSocial,
  Especialidad,
  Rol,
  MetodoPago
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
    await sequelize.sync({ alter: false }); // O false si ya está todo bien
  //  await seedObrasSociales();
  // await seedEspecialidades()
  //await generarRolesBase(); 
  //await genmetodosPago()
    console.log('Modelos sincronizados son la base de datos');
  } catch (error) {
    console.error('Error al sincronizar modelos con la base de datos:', error);
  }
};

syncModels();
export default sequelize;
export { models };
