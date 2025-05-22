// seeders/manual/especialidadesSeed.js
import Especialidad from '../models/Especialidad.js';

const especialidades = [
  'Cardiología',
  'Pediatría',
  'Traumatología',
  'Dermatología',
  'Ginecología',
  'Neurología',
  'Clínica Médica',
  'Otorrinolaringología',
  'Oftalmología',
  'Urología',
  'Psiquiatría',
  'Psicología',
  'Reumatología',
  'Gastroenterología',
  'Oncología',
];

export default async function seedEspecialidades() {
  for (const nombre of especialidades) {
    await Especialidad.findOrCreate({
      where: { nombre },
      defaults: { nombre },
    });
  }

  console.log('🌱 Seed de especialidades completado');
}
