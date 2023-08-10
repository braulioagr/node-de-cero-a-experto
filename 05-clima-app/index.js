import * as dotenv from 'dotenv'
import colors from 'colors';

import { Busquedas } from './models/busquedas.js';
import { inquirerMenu, leerInput, listarLugares, pausa } from './helpers/inquirer.js';

dotenv.config();

const main = async () => {
    let opt = -1;
    const busquedas = new Busquedas;
    do{
        
        opt = await inquirerMenu(inquirerMenu);
        switch( opt ){
            case 1:
                const termino = await leerInput( 'Ciudad: ' );
                const lugares = await busquedas.ciudad( termino );
                const id = await listarLugares( lugares );
                if( id === '0') { continue; }

                const { nombre, lat, lng} = lugares.find( lugar => lugar.id === id );
                busquedas.agregarHistorial( nombre );
                const { desc, max, min, temp } = await busquedas.clima(lat, lng);

                console.clear();

                console.log('\nInformaciona de la ciudad\n'.green);
                console.log( 'Ciudad:', nombre.green );
                console.log( 'Lat:', lat);
                console.log( 'Lng:', lng );
                console.log( 'Temperatura:' , temp );
                console.log( 'Mínima:' , min );
                console.log( 'Máxima:' , max );
                console.log( 'Descripción:' , desc.green );
            
            case 2:
                busquedas.historialCapitalizado.forEach( (lugar, i) =>  {
                    const idx = `${ i + 1 }.`.green;
                    console.log( `${ idx } ${ lugar } ` );
                })
            break;
        }
        if( opt !== 0 ) { await pausa() }
    }while( opt !== 0 )

    await pausa();
    console.clear();

}

main();