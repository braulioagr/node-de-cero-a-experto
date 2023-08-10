import { Router } from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js'
import { cargarArchivo } from '../controllers/uploads.js';

export const UploadsRouter = Router();

UploadsRouter.post('/', cargarArchivo)
