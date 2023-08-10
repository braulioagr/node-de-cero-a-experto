import { Router } from 'express';
import { check } from 'express-validator';
import { validarCampos, validarJWT, tieneRole } from '../middlewares/index.js';
import { postProducto, putProducto, deleteProducto, getProducto, getByIdProducto } from '../controllers/productos.js';
import { existeProductoPorId } from '../helpers/db-validators.js'



export const ProductosRouter = Router();


ProductosRouter.post('/', [
  validarJWT,
  check('nombre','El nombre es obligatorio').not().isEmpty(),
  check('categoria','No es un id de Mongo').isMongoId(),
  check('categoria').custom( existeProductoPorId ),
], postProducto);


ProductosRouter.get('/', getProducto);

ProductosRouter.get('/:id', [
  check('id', 'No es un id de Mongo válido').isMongoId(),
  check('id').custom( existeProductoPorId ),
  validarCampos,
  validarCampos
],getByIdProducto);


ProductosRouter.put('/:id',  [
  validarJWT,
  // check('categoria','No es un id de Mongo').isMongoId(),
  check('id').custom( existeProductoPorId ),
  validarCampos
], putProducto);

ProductosRouter.delete('/:id', [
  validarJWT,
  tieneRole('ADMIN_ROLE'),
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existeProductoPorId),
  validarCampos
],deleteProducto);