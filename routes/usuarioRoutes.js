import express from 'express'
import {confirmar,restablecerPassword, formularioLogin, formularioRegistro, recuperarPassword, registrar, nuevoPassword, comprobarToken} from '../controllers/usuarioController.js'
const router = express.Router()

//Routing
router.get('/login', formularioLogin)

router.get('/registro', formularioRegistro)
router.post('/registro', registrar)

router.get('/confirmarCuenta/:token', confirmar)
router.get('/recuperar', recuperarPassword)
router.post('/recuperar', restablecerPassword)


//Almacena el nuevo password
router.get('/recuperarPassword/:token', comprobarToken)
router.post('/recuperarPassword/:token', nuevoPassword)
export default router