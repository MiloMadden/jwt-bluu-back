
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const {verificaToken} = require('./middlewares/validartoken')

const app = express();

// cors
const cors = require('cors');
var corsOptions = {
    origin: '*', // Reemplazar con dominio
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));

// capturar body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Conexión a Base de datos
const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.2ntwx.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
//console.log(process.env.DBNAME)

mongoose.connect(uri, 
    { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log('Base de datos conectada'))
.catch(e => console.log('error db:', e))

// import routes
const autRuta = require('./routes/aut');
const otrasRuta = require('./routes/otras');

// route middlewares
app.use('/api', autRuta)
app.use('/api/otras', verificaToken, otrasRuta)

app.get('/', (req, res)=>{
    res.json({
        message: 'Pagina Principal'
    })
})

// iniciar server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`servidor andando en: ${PORT}`)
})