//const express = require('express') //CommonJS
import express from 'express' //ECMAScript MODULE
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import usuarioRoutes from './routes/usuarioRoutes.js'
import db from './configs/db.js';

//Crear la app
const app = express()
//Habilitar lectura de formularios
app.use( express.urlencoded({extended:true}))

//Habiliar Cookie-Parser
app.use(cookieParser())
//Habilitar CSRF
app.use(csrf({ cookie:true}))

try {
    await db.authenticate();
    db.sync()
    console.log("conexión bien")
} catch (error) {
    console.log(error)
}
//Template engine - -Motores de Plantillas
//Pug
app.set('view engine', 'pug')
app.set('views', './views')

//Caperta pública
app.use(express.static('public'))


//Routing
app.use("/auth", usuarioRoutes)



//Definir un puerto y arrancar el proyecto

const port =process.env.PORT || 3000

app.listen(port, () =>{
    console.log("El servidor esta jalando")
});