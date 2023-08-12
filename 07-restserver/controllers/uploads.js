import { response } from "express";
import { subirArchivo } from "../helpers/index.js";
import { Usuario, Producto } from "../models/index.js"
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import * as path from 'path';
import * as fs from 'fs';

const cargarArchivo = async (req, res =  response) => {
  console.log('req.files >>>', req.files);
  try {
    //const nombre = await subirArchivo(req.files, ['txt','md'], 'textos')
    const nombre = await subirArchivo(req.files, undefined, 'imgs')
    res.json({ nombre }) 
  } catch (msg) {
    res.status(400).json({msg})
  }

}

const actualizarImagen = async (req, res =  response) => {

  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById( id );
      if(!modelo) {
        return res.status(400).json({ msg: `No existe un usuario con el id: ${id}`});
      }
    break;
    case 'productos':
      modelo = await Producto.findById( id );
      if(!modelo) {
        return res.status(400).json({ msg: `No existe un producto con el id: ${id}`});
      }
    break;
    default:
      return res.status(500).json({ msg: 'Se me olvido validar esto'});
  }

  //Limpiar imagenes previas
  if(modelo.img){
    const pathImg = path.join(__dirname, '../uploads', coleccion, modelo.img);
    if(fs.existsSync(pathImg)){
      fs.unlinkSync(pathImg);
    }
  }

  modelo.img = await subirArchivo(req.files, undefined, coleccion);
  await modelo.save();
  res.json(modelo);
}

const mostrarImagen = async (req, res = response) => {
  const { id, coleccion } =  req.params
  const pathPlaceholder = path.join(__dirname, '../assets', 'no-image.jpg');


  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById( id );
      if(!modelo) {
        return res.sendFile(pathPlaceholder);
      }
    break;
    case 'productos':
      modelo = await Producto.findById( id );
      if(!modelo) {
        return res.sendFile(pathPlaceholder);
      }
    break;
    default:
      return res.status(500).json({ msg: 'Se me olvido validar esto'});
  }

  if(modelo.img){
    const pathImg = path.join(__dirname, '../uploads', coleccion, modelo.img);
    if(fs.existsSync(pathImg)){
      return res.sendFile(pathImg);
    }

  }
  return res.sendFile(pathPlaceholder);
}

export {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen
}