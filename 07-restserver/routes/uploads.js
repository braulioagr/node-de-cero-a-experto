import { Router } from 'express';
import { actualizarImagen, cargarArchivo, mostrarImagen } from '../controllers/uploads.js';
import { check } from 'express-validator';
import { validarCampos, validarArchivoSubir } from '../middlewares/index.js';
import { coleccionesPermitidas } from '../helpers/index.js'

export const UploadsRouter = Router();

UploadsRouter.post('/', validarArchivoSubir, cargarArchivo);
UploadsRouter.put('/:coleccion/:id', [
  validarArchivoSubir,
  check('id', 'El id debe ser un id de monogo').isMongoId(),
  check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] )),
  validarCampos
], actualizarImagen);

UploadsRouter.get('/:coleccion/:id', [
  check('id', 'El id debe ser un id de monogo').isMongoId(),
  check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] )),
  validarCampos
], mostrarImagen)