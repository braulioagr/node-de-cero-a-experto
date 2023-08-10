import axios from 'axios';
import fs from 'fs';
export class Busquedas{
    historial = [];
    dbPath = './db/database.json';


    constructor(){
        this.leerDB();
    }

    get historialCapitalizado() {
        return this.historial.map( lugar => {

            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );

            return palabras.join(' ')

        });
    }


    get paramsMapbox(){
        return {
            'access_token'  :   process.env.MAPBOX_KEY,
            'language'      :   'es',
            'limit'         :   5
        }
    }

    async ciudad(lugar){

        try{
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox
            });
            
            const resp =  await instance.get();            
            
            return resp.data.features.map(( { id, place_name, center } ) => ({
                id      :   id,
                nombre  :   place_name,
                lng     :   center[0],
                lat     :   center[1]
            }));
        }
        catch(error){
            return [];
        }
    }

    async clima( lat, lon ){
        try{
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {
                    'appid' :   process.env.OPENWEATHER_KEY,
                    'units' :   'metric',
                    'lang'  :  'es',
                    lat,
                    lon
                }
            });

            const { data } =  await instance.get();
            const { weather, main } = data;
            const {temp, temp_min, temp_max } = main;
            return {
                desc: weather[0].description,
                max: temp_max,
                min: temp_min,
                temp
            }
        }
        catch(error){
            console.log( error );
        }
    }

    

    agregarHistorial( lugar = '' ) {

        if( this.historial.includes( lugar.toLocaleLowerCase() ) ){
            return;
        }
        this.historial = this.historial.splice(0,5);
        this.historial.unshift( lugar.toLocaleLowerCase() );
        this.guardarDB();
    }

    guardarDB() {

        const payload = {
            historial: this.historial
        };
        fs.writeFileSync( this.dbPath, JSON.stringify( payload ) );
    }

    leerDB() {

        if( !fs.existsSync( this.dbPath ) ) return;        
        const info = fs.readFileSync( this.dbPath, { encoding: 'utf-8' });
        const data = JSON.parse( info );
        this.historial = data.historial;


    }

}

