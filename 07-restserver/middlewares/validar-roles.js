import { response } from "express";


export const esAdminRole = (req, res = response, next) => {

    if(!req.usuario){
        return res.status(500).json({
            msg: 'se quiere verficar el role sin validar el token primero'
        })
    }
    const { rol, nombre } = req.usuario;
    if(rol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${nombre} no es administrador - No puede hacer esto`
        }) 
    }
    next();
}

export const tieneRole = ( ...roles ) => {
    return (req, res = response, next) => {

    const { rol, nombre } = req.usuario;
        if(!roles.includes(rol)){
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles [${roles}]`
            }) 
        }
        next();
    }
}