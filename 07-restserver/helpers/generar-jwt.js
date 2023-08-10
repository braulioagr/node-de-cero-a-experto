import jwt from 'jsonwebtoken';
export const generarJWT = ( uid = '' ) => {

    return new Promise( (resolve, reject) =>{
        const payload = { uid };

        jwt.sign( payload, process.env.SECRETORPRIVATEKEY,{
            expiresIn: '4h'
        }, (error, token) => {
            if(error){
                console.log(error);
                reject('No se pudo geterar el token')
            } else {
                resolve(token);
            }
        })

    })

}
