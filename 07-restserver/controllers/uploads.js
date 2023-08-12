import { response } from "express";
import { subirArchivo } from "../helpers/index.js";
import { Usuario, Producto } from "../models/index.js"
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import * as path from 'path';
import * as fs from 'fs';
import { v2 } from 'cloudinary';
import { log } from "console";
const cloudinary = v2;

const callCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  return cloudinary;
}

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


const actualizarImagenCloudinary = async (req, res =  response) => {
  try{
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
      const arrayFile = modelo.img.split('/');
      const nombre =  arrayFile[ arrayFile.length - 1 ];
      const [ public_id ] = nombre.split('.');
      await callCloudinary().uploader.destroy( public_id );
    }

    const { tempFilePath } = req.files.archivo;
    
    const { secure_url } =  await callCloudinary().uploader.upload(tempFilePath);
  
    modelo.img = secure_url;
    await modelo.save();
    
    res.json(modelo);
  }
  catch(error){
    return res.status(500).json({ msg: error});
  }
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
  mostrarImagen,
  actualizarImagenCloudinary
}