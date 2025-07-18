'use strict';

export async function up(queryInterface, Sequelize) {
    const obrasSocialesListado = [
    "DOSEP",
    "DOSPU",
    "MEDICAL GISS",
    "BOREAL",
    "NOBIS",
    "OSDE (DIAGNOSTICO POR IMÁGENES)",
    "PAMI (MEDICOS DE CABECERA)",
    "UTA",
    "LUZ Y FUERZA",
    "OSSEG",
    "PREVENCION SALUD",
    "OMINT CONSOLIDAR",
    "JERAQUICOS SALUD",
    "AVALIAN",
    "UNIMED",
    "SCIS",
    "OSETYA",
    "PERFUMISTAS (OSPAP)",
    "OBRA SOCIAL DE PINTURA",
    "PAPELEROS",
    "MEDYCIN",
    "ROISA (PANADEROS Y DOCTOR RED)",
    "OSPATCA",
    "CEA SAN PEDRO",
    "ASOC MOTOCICLISTAS",
    "TV SALUD (PERSONAL DE TELEVISION)",
    "OSETRA",
    "AMFFA",
    "BRAMED",
    "PODER JUDICIAL",
    "W. HOPE",
    "FEDERADA SALUD",
    "OSADEF - EMPLEADOS DE FARMACIA",
    "FEMESA",
    "FUTBOLISTAS",
    "GALENO",
    "IMAGEN EN SALUD - OSPAPEL",
    "MEDICUS",
    "MEDIFE",
    "OPDEA",
    "OSFATUN",
    "OSMATA",
    "OSPFeSIQyP",
    "OSSACRA-AMASALUD",
    "OSSEG",
    "PERSONAL DE FARMACIA",
    "RED DE SEGURO MEDICO",
    "SADAIC",
    "SANCOR SALUD",
    "SMAI",
    "SWISS MEDICAL",
    "TV SALUD",
    "UNION PERSONAL",
    "UTA"
  ];

 
  const timestamp = new Date();
  const data = obrasSocialesListado.map(nombre => ({
    nombre,
    createdAt: timestamp,
    updatedAt: timestamp
  }));

  await queryInterface.bulkInsert('obras_sociales', data, {});
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('obras_sociales', null, {});
}