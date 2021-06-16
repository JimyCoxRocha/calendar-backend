const express = require("express");
//parecido a import express from "express"
require ( "dotenv" ).config();
var cors = require('cors');
const { dbConnection } = require( "./database/config" );

//Crear el servido de express
const app = express();

//Base de datos
dbConnection();

//Aplicación de CORS
app.use(cors());

//Directorio Publico
app.use( express.static( "public" ) );//este es un middlewere

//Lectura y parseo del body
app.use( express.json() );

////////////////End Points//////////////////
// Rutas
//TODO: auth // crear, login, renew
app.use( "/api/auth", require("./routes/auth") );
//TODO: CRUD: Eventos
app.use( "/api/events", require("./routes/events") );

//Escuchar peticiones
app.listen( process.env.PORT, ()=>{
    // console.log(`Servidor corriendo en puerto: ${ process.env.PORT }`);
} );//colocar el puerto, 3000 no colocal porque ahí esta react