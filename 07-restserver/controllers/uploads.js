import { response } from "express";
import { subirArchivo } from "../helpers/subir-archivo.js";


const cargarArchivo = async (req, res =  response) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    res.status(400).json({ msg: 'No files were uploaded.'});
    return;
  }
  console.log('req.files >>>', req.files); // eslint-disable-line

  //Imagenes
  const nombre = await subirArchivo(req.files)
  res.json({
    nombre
  })

}

export {
  cargarArchivo
}