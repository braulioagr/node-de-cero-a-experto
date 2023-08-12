import { Router } from 'express';
import { check } from 'express-validator';

// import { validarCampos } from '../middlewares/validar-campos.js'
// import { validarJWT } from '../middlewares/validar-jwt.js';
// import { esAdminRole, tieneRole } from '../middlewares/validar-roles.js';
import { validarCampos, validarJWT, tieneRole } from '../middlewares/index.js';

import { esRoleValido, emailExiste, existeUsuarioPorId } from '../helpers/db-validators.js'
import
{
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch,
    usuariosGetById
} from '../controllers/usuarios.js'

export const UserRouter = Router();

UserRouter.get('/', usuariosGet);

UserRouter.get('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
],usuariosGetById)

UserRouter.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPut);

UserRouter.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(emailExiste),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPost);

UserRouter.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);

UserRouter.patch('/', usuariosPatch);
