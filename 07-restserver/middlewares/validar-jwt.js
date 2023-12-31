import { request, response } from 'express';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/index.js';

export const validarJWT = async ( req = request, res = response, next ) => {
    const token =  req.header('x-token');
    if(!token){
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }
    try{
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        const usuario = await Usuario.findById(uid);
        if(!usuario){
            return res.status(401).json({
                msg: 'Token no valido - usuario no existe'
            });
        }

        //verificar si el uid tiene estado en true
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Token no valido - usuario con estado false'
            });
        }
        req.usuario = usuario;
        next();
    }
    catch(error){
        console.log(error);
        return res.status(401).json({
            msg: 'Token no valido'
        });
    }

}