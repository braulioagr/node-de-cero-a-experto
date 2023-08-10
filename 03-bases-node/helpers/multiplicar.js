var colors = require('colors');
const fileSystem = require('fs');
const crearArchivo = async( base, listar, hasta ) => {
    
    try {
        let data, consola = '';
        for(let i = 1 ;  i <= hasta ; i++)
        {
            data += `${base} x ${i} = ${i * base} \n`;
            consola += '          '+ colors.red( base ) + ' x ' + colors.green( i ) + ' = ' + colors.blue( i * base ) +'\n';
        }
        if(listar){
            console.log('====================================='.green)
            console.log('          Tabla del '.green, colors.blue( base ))
            console.log('====================================='.green)
            console.log (consola);
        }

        fileSystem.writeFileSync(`tabla-${ base }.txt`, data);
        return `tabla-${ base }.txt`;
    } catch (error) {
        throw error;
    }
}



module.exports={
    crearArchivo
}