import * as url from 'url';
import express from 'express';
import hbs from 'hbs';
import * as dotenv from 'dotenv'
dotenv.config();
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const app = express();
const port = process.env.PORT;


hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');


app.use( express.static( 'public' ) );

app.get('/', (req, res)=>{
    res.render('home',{
        nombre: 'Braulio',
        titulo: 'Curso de node'
    });
});

app.get('/generic', function (req, res) {
  //res.sendFile( __dirname + '/public/generic.html' );
    res.render('generic');
});

app.get('/elements', function (req, res) {
  //res.sendFile( __dirname + '/public/elements.html' );
    res.render('elements');
});

app.get('*', function ( req, res ) {
  //res.sendFile( __dirname + '/public/404.html' );
    res.render('404');
});

app.listen( port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});