
const { crearArchivo } = require('./helpers/multiplicar');
const argv =  require('./config/yargs');
var colors = require('colors/safe');

console.clear();
console.log(argv.h)
crearArchivo( argv.b, argv.l, argv.h)
    .then( nombreArchivo => console.log(colors.green(`${nombreArchivo} creado`)))
    .catch( error => console.log( colors.red(error) ) );