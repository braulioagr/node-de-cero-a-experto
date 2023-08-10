import { response } from "express";
import { Usuario } from "../models/index.js";
import { generarJWT } from "../helpers/generar-jwt.js"
import bcrypt from 'bcryptjs';
import { googleVerify } from "../helpers/google-verify.js";

const login = async (req, res = response) =>
{

  const { correo, password } = req.body;
  try {

    //verificar si existe el email
    console.log(correo);
    const usuario = await Usuario.findOne({ correo });
    if (!usuario)
    {

      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - email'
      })

    }

    //verificar si el usuario esta activo
    if (!usuario.estado) {

      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - estado'
      });

    }

    //verificar contraseña
    const validPassword = bcrypt.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - password'
      });
    }

    //Generar JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token
    });
  }
  catch (error)
  {
    console.log(error);
    return res.status(500).json({
      msg: 'Hable con el administrador'
    })
  }
}

const googleSingIn = async (req, res = response) =>
{
  const { id_token } = req.body;
  try
  {
    const { nombre, img, correo } = await googleVerify(id_token);
    let usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      const data = {
        nombre,
        correo,
        password: ':P',
        img,
        rol: 'USER_ROLE',
        google: true,
      }
      usuario = new Usuario(data);
      await usuario.save();
    }

    if( !usuario.estado ){
      return res.status(401).json({
        msg: 'Hable con el administrador, usuario bloqueado'
      });
    }
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token
    })
  }
  catch (error) {
    console.log(error)
    json.status(400).json({
      ok: false,
      msg: 'El token no se pudo verificar'
    })
  }

}

export {
  login,
  googleSingIn
};