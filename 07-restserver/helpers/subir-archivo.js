import * as path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const subirArchivo = ( files, extensionesValidas = ['png','jpg','jpeg','gif'], carpeta = '' ) => {

  return new Promise((resolve, reject)=>{
    
    const { archivo } = files;
    const nombreCortado =  archivo.name.split('.');
    const extencion = nombreCortado[ nombreCortado.length - 1 ];

    if(!extensionesValidas.includes(extencion)) {
      return reject(`La extension ${extencion} no es valida - ${extensionesValidas}`);
    }
    
    const nombreTemp = `${uuidv4()}.${extencion}`;
    const uploadPath = path.join( __dirname, '../uploads/', carpeta, nombreTemp );
    
    archivo.mv(uploadPath, function(err) {
      if (err) {
        return reject(err)
      }
    
      resolve(nombreTemp);
    });
  });

}

export {
  subirArchivo
}