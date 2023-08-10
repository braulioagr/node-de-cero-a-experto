import http from 'http'

http.createServer( ( req , res ) =>{
    res.writeHead(200, { 'Content-Type': 'application/json' });

    const person = {
        Nombre: 'Braulio Alejandro',
        Apellido: 'Garcia Rivera',
        Edad: '26'
    }

    res.write( JSON.stringify(person) );
    res.end();

})
.listen(8080)

console.log('Ecuchando el puerto: ', 8080);