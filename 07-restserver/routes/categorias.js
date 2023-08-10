import { Router } from 'express';
import { check } from 'express-validator';
import { validarCampos, validarJWT, tieneRole } from '../middlewares/index.js';
import { postCategoria, putCategoria, deleteCategoria, getCategoria, getByIdCategoria } from '../controllers/categorias.js';
import { existeCategoriaPorId } from '../helpers/db-validators.js'



export const CategoriasRouter = Router();

CategoriasRouter.post('/', [
  validarJWT,
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  validarCampos
], postCategoria);


CategoriasRouter.get('/', getCategoria);

CategoriasRouter.get('/:id', [
  validarJWT,
  check('id', 'Mo es un id de Mongo valido').isMongoId(),
  check('id').custom(existeCategoriaPorId),
  validarCampos
],getByIdCategoria);


CategoriasRouter.put('/:id',  [
  validarJWT,
  tieneRole('ADMIN_ROLE'),
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existeCategoriaPorId),
  validarCampos
], putCategoria);

CategoriasRouter.delete('/:id', [
  validarJWT,
  tieneRole('ADMIN_ROLE'),
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existeCategoriaPorId),
  validarCampos
],deleteCategoria);