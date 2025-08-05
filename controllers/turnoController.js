import Turno from '../models/Turno.js';
import Paciente from '../models/Paciente.js';
import Profesional from '../models/Profesional.js';
import Especialidad from '../models/Especialidad.js';
import ObraSocial from "../models/ObraSocial.js";
import DiaLibre from '../models/DiasLibre.js';
import PDFDocument from "pdfkit";
import { Op } from "sequelize";

/**
 * Crear un nuevo turno
 */

export const crearTurno = async (req, res) => {
  try {
    const { start, end, profesionalId } = req.body;

    const fechaTurno = new Date(start);

    // Buscar si cae en un día libre
    const diaLibre = await DiaLibre.findOne({
      where: {
        profesionalId,
        fechaInicio: { [Op.lte]: fechaTurno },
        fechaFin: { [Op.gte]: fechaTurno }
      }
    });

    if (diaLibre) {
      const desde = new Date(diaLibre.fechaInicio).toISOString().slice(0, 10);
      const hasta = new Date(diaLibre.fechaFin).toISOString().slice(0, 10);
      return res.status(400).json({
        error: `El profesional está de vacaciones del ${desde} al ${hasta}.`
      });
    }

    const turno = await Turno.create(req.body);
    console.log("FECHA QUE LLEGA DEL FRONT:", start, end);
    res.status(201).json(turno);
  } catch (err) {
    console.error("Error en crearTurno:", err);
    res.status(400).json({ error: err.message });
  }
};

/**
 * Obtener todos los turnos
 */
export const obtenerTurnos = async (req, res) => {
  try {
    const turnos = await Turno.findAll({
      include: [{
        model: Paciente,
        as: 'Paciente'  // IMPORTANTE usar el alias aquí
      },{
        model: Profesional,
        as: 'Profesional'  // IMPORTANTE usar el alias aquí
      },]
    });
    res.json(turnos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Obtener un turno por ID
 */
export const obtenerTurnoPorId = async (req, res) => {
  try {
    const turno = await Turno.findByPk(req.params.id, {
      include: [
        { model: Paciente, as: 'Paciente' },
        { model: Profesional, as: 'Profesional' }
      ]
    });
    

    if (!turno) {
      return res.status(404).json({ error: 'Turno no encontrado' });
    }

    res.json(turno);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Obtener turnos por paciente ID
 */
export const obtenerTurnosPorPaciente = async (req, res) => {
  try {
    const { pacienteId } = req.params;
    const turnos = await Turno.findAll({
      where: { pacienteId },
      include: [
        { 
          model: Profesional,
          as: 'Profesional',
          include: [{
            model: Especialidad,
            as: 'especialidades',
            attributes: ['id', 'nombre'] // Solo traemos estos campos
          }]
        }
      ],
    });
    res.json(turnos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Obtener turnos por profesional ID
 */
 export const obtenerTurnosPorProfesional = async (req, res) => {
  try {
    const { profesionalId } = req.params;
    const turnos = await Turno.findAll({
      where: { profesionalId },
      include: [
        {
          model: Paciente,
          as: 'Paciente'  
        }
      ]
    });
    res.json(turnos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Obtener turnos por día (rango desde 00:00 hasta 23:59)
 */
export const obtenerTurnosPorDia = async (req, res) => {
  try {
    const { fecha } = req.query; // formato esperado: YYYY-MM-DD

    if (!fecha) {
      return res.status(400).json({ error: 'Se requiere una fecha en query param' });
    }

    const startOfDay = new Date(`${fecha}T00:00:00`);
    const endOfDay = new Date(`${fecha}T23:59:59`);

    const turnos = await Turno.findAll({
      where: {
        fechaHora: {
          [Op.between]: [startOfDay, endOfDay]
        }
      },
      include: [Paciente, Profesional]
    });

    res.json(turnos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
/**
 * Obtener turnos por profesional y día (agenda del profesional para ese día)
 * GET /profesionales/:profesionalId/turnos-dia?fecha=YYYY-MM-DD
 */
 export const obtenerTurnosPorProfesionalYDia = async (req, res) => {
  try {
    const { profesionalId } = req.params;
    const { fecha } = req.query; // formato esperado: YYYY-MM-DD

    if (!fecha) {
      return res.status(400).json({ error: 'Se requiere una fecha en query param (YYYY-MM-DD)' });
    }

    const startOfDay = new Date(`${fecha}T00:00:00`);
    const endOfDay = new Date(`${fecha}T23:59:59`);

    const turnos = await Turno.findAll({
      where: {
        profesionalId,
        fechaHora: {
          [Op.between]: [startOfDay, endOfDay]
        }
      },
      include: [
        {
          model: Paciente,
          as: 'Paciente'
        },
        {
          model: Profesional,
          as: 'Profesional'
        }
      ],
      order: [['fechaHora', 'ASC']]
    });

    res.json(turnos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Actualizar un turno
 */
export const actualizarTurno = async (req, res) => {
  try {
    const turno = await Turno.findByPk(req.params.id);
    if (!turno) {
      return res.status(404).json({ error: 'Turno no encontrado' });
    }

    await turno.update(req.body);
    res.json(turno);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Eliminar (soft-delete) un turno
 */
export const eliminarTurno = async (req, res) => {
  try {
    const turno = await Turno.findByPk(req.params.id);
    if (!turno) {
      return res.status(404).json({ error: 'Turno no encontrado' });
    }

    await turno.destroy();
    res.json({ message: 'Turno eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Restaurar un turno eliminado
 */
export const restaurarTurno = async (req, res) => {
  try {
    const turno = await Turno.findByPk(req.params.id, { paranoid: false });
    if (!turno) {
      return res.status(404).json({ error: 'Turno no encontrado' });
    }

    await turno.restore();
    res.json({ message: 'Turno restaurado', turno });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const generarAgendaPDFPorProfesionalYDia = async (req, res) => {
  try {
    const { profesionalId } = req.params;
    const { fecha } = req.query; // formato esperado: YYYY-MM-DD

    if (!fecha) {
      return res.status(400).json({ error: 'Se requiere una fecha en query param (YYYY-MM-DD)' });
    }

    const startOfDay = new Date(`${fecha}T00:00:00`);
    const endOfDay = new Date(`${fecha}T23:59:59`);

   
    // Convertir a UTC para la consulta
    const startOfDayUTC = new Date(startOfDay.getTime() - startOfDay.getTimezoneOffset() * 60000);
    const endOfDayUTC = new Date(endOfDay.getTime() - endOfDay.getTimezoneOffset() * 60000);


    const turnos = await Turno.findAll({
      where: {
        profesionalId,
        start: {
          [Op.between]: [startOfDayUTC, endOfDayUTC]
        }
      },
      include: [
        { model: Paciente, as: 'Paciente' },
        { model: Profesional, as: 'Profesional' },
        { model: ObraSocial, as: 'ObraSocial' }
      ],
      order: [['start', 'ASC']]
    });

    if (!turnos.length) {
      return res.status(404).json({ error: "No hay turnos para ese día" });
    }

    // Configuración de columnas (proporciones ajustadas)
    const columns = [
      { label: "Hora", width: 40 },            // 50 * 0.7
      { label: "Durac.", width: 42 },        // 60 * 0.7
      { label: "Tipo", width: 60 },
      { label: "Obra Soc.", width: 130 },    // 110 * 1.2
      { label: "Paciente", width: 125 },
      { label: "Valor", width: 60 },
      { label: "Seña", width: 50 },
      { label: "Motivo", width: 100 },
      { label: "Observaciones", width: 130 },
      { label: "Asis.", width: 25 }
    ];
    const rowMinHeight = 22;
    const startX = 40;
    let posY = 120;

    // Crear el PDF en modo landscape
    const doc = new PDFDocument({ margin: 35, size: 'A4', layout: 'landscape' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="agenda_profesional_${profesionalId}_${fecha}.pdf"`);
    doc.pipe(res);

    // Encabezado
    const profesional = turnos[0].Profesional;
    doc.fontSize(16).text(`Agenda de ${profesional.nombre} ${profesional.apellido}`, { align: 'center' });
    doc.fontSize(10).text(`Fecha: ${fecha}`, { align: 'center' });
    doc.moveDown(0);

    // Definir color de borde de la grilla gris
    doc.strokeColor('#bbbbbb');



doc.registerFont('Actor', './fonts/Actor-Regular.ttf');
doc.registerFont('ArchivoNarrow', './fonts/ArchivoNarrow-Regular.ttf');
doc.registerFont('ArchivoNarrow-Bold', './fonts/ArchivoNarrow-Bold.ttf');
    // Cabecera de la tabla (fondo gris claro)
    
doc.font('ArchivoNarrow');
    let posX = startX;
    doc.font("ArchivoNarrow-Bold").fontSize(10);
    columns.forEach(col => {
      doc
        .fillColor('#f5f5f5')
        .rect(posX, posY, col.width, rowMinHeight)
        .fillAndStroke();
      doc
        .fillColor('black')
        .text(col.label, posX + 2, posY + 6, { width: col.width - 4, align: "left" });
      posX += col.width;
    });

    // Filas de turnos con altura dinámica según contenido
  
    doc.font('ArchivoNarrow').fontSize(10);
    posY += rowMinHeight;

      // Función para formatear la hora en zona horaria local
      const formatLocalTime = (date) => {
        return new Date(date).toLocaleTimeString("es-AR", {
          timeZone: 'America/Argentina/Buenos_Aires',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
      };

          // Función para calcular duración en zona horaria local
    const calculateLocalDuration = (start, end) => {
      const startLocal = new Date(start);
      const endLocal = new Date(end);
      const duracionMs = endLocal - startLocal;
      return Math.round(duracionMs / 60000);
    };


    turnos.forEach(turno => {
      posX = startX;

      // Usar las funciones de zona horaria local
      const hora = formatLocalTime(turno.start);
      const duracionMin = calculateLocalDuration(turno.start, turno.end);

    
      const obraSocial = turno.ObraSocial?.nombre
  ? `${turno.ObraSocial.nombre}${turno.Paciente?.nAfiliado ? `  ( N°:${turno.Paciente.nAfiliado})` : ''}`
  : '';

      const paciente = `${turno.Paciente?.nombre || ''} ${turno.Paciente?.apellido || ''}  (DNI:${turno.Paciente?.dni || 'sin DNI'})`;
      const costoTotal = turno.costoTotal !== undefined ? `$${turno.costoTotal}` : '';
      const sena = turno.sena !== undefined ? `$${turno.sena}` : '';
      const motivo = turno.motivo || '';
      const notas = turno.notas || '';

      const fila = [
        hora,
        duracionMin + " min",
        turno.tipo,
        obraSocial,
        paciente,
        costoTotal,
        sena,
        motivo,
        notas, // Observaciones (vacío)
        ""  // Asist (vacío)
      ];

      // Calcular la altura necesaria de la fila según el contenido de cada celda
      const cellHeights = fila.map((cell, i) =>
        doc.heightOfString(String(cell), {
          width: columns[i].width - 4,
          align: "left"
        })
      );
      const dynamicRowHeight = Math.max(...cellHeights, rowMinHeight);

      
  // ======= Chequeo antes de dibujar =======
  if (posY + dynamicRowHeight > doc.page.height - 40) {
    doc.addPage({ layout: 'landscape' });
    posY = 40;
    posX = startX;
    doc.strokeColor('#bbbbbb');
    doc.font('ArchivoNarrow-Bold').fontSize(10);
    columns.forEach(col => {
      doc
        .fillColor('#f5f5f5')
        .rect(posX, posY, col.width, rowMinHeight)
        .fillAndStroke();
      doc
        .fillColor('black')
        .text(col.label, posX + 2, posY + 6, { width: col.width - 4, align: "left" });
      posX += col.width;
    });
    doc.font('ArchivoNarrow').fontSize(10);
    posY += rowMinHeight;
  }
  // ========================================

      fila.forEach((cell, i) => {
        doc
          .fillColor('white')
          .rect(posX, posY, columns[i].width, dynamicRowHeight)
          .fillAndStroke();
        doc
          .fillColor('black')
          .text(String(cell), posX + 4, posY + 1, {
            width: columns[i].width - 4,
            align: "left",
            lineGap: -1
          });
        posX += columns[i].width;
      });
      posY += dynamicRowHeight;

      // Salto de página si es necesario
      if (posY > doc.page.height - 60) {
        doc.addPage({ layout: 'landscape' });
        posY = 40;
        // Repetir cabecera de tabla en nueva página
        posX = startX;
        doc.strokeColor('#bbbbbb');
        doc.font('ArchivoNarrow').fontSize(19);
        columns.forEach(col => {
          doc
            .fillColor('#f5f5f5')
            .rect(posX, posY, col.width, rowMinHeight)
            .fillAndStroke();
          doc
            .fillColor('black')
            .text(col.label, posX + 2, posY + 2, { width: col.width - 4, align: "left" });
          posX += col.width;
        });
        doc.font('ArchivoNarrow').fontSize(9);
        posY += rowMinHeight;
      }
    });

    doc.end();
  } catch (err) {
    console.error("Error generando PDF:", err);
    res.status(500).json({ error: err.message });
  }
};