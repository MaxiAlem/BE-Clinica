import express from "express";
import { obtenerActividades, filtrarActividades } from "../controllers/actividadController.js";


const actividadRouter = express.Router();

actividadRouter.get("/", obtenerActividades);
actividadRouter.get("/filtrar", filtrarActividades);

export default actividadRouter;
