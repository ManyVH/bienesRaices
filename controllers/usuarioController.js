import {check, validationResult} from 'express-validator'
import Usuario from '../models/Usuario.js'
import { generarID } from '../helpers/tokens.js'
import {emailRecuperarPassword, emailRegistro} from '../helpers/emails.js'
const formularioLogin = (req, res)=> {
    res.render('auth/login',{
        pagina: "Iniciar Sesión"
    })
}

const formularioRegistro = (req, res)=> {
    console.log(req.csrfToken())
    res.render('auth/registro',{
        pagina: "Crear cuenta",
        csrfToken: req.csrfToken()
    })
}

const recuperarPassword = (req, res)=> {
    res.render('auth/recuperar',{
        pagina: "Recuperar Contraseña",
        csrfToken: req.csrfToken(),
    })
}

const restablecerPassword = async (req, res)=> {
    await check('email').isEmail().withMessage('No es un email').run(req)
    
    let resultado = validationResult(req) 
    
    if (!resultado.isEmpty()) {
        return res.render('auth/recuperar',{
            pagina: "Recuperar Contraseña",
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario:{
                email: req.body.email
            }

        })
    }

    //Buscar usuario
    const {email} = req.body;
    const usuario = await Usuario.findOne({where: {email}})

    console.log(usuario)
    //No existe el usuario
    if (!usuario) {
        return res.render('auth/recuperar',{
            pagina: "Recuperar Contraseña",
            csrfToken: req.csrfToken(),
            errores: [{msg:"El correo no pertenece a ningún usuario"}]

        })
    }
    //Generar nuevo token
    usuario.token = generarID()
    await usuario.save()

    //Enviar el email
    emailRecuperarPassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token:usuario.token
    })

    //Renderizar mensaje

    return res.render('templates/mensaje',{
        pagina: "Recupera tu Contraseña",
        mensaje: 'Hemos enviado un email con las instrucciones'


    })
}

const comprobarToken = async (req, res) =>{
    const {token} = req.params;

    const usuario = await Usuario.findOne({where: {token}})
    console.log(usuario)
    if(!usuario){
        return res.render('auth/confirmarCuenta',{
            pagina: "Restablece tu contraseña",
            mensaje: "Hubo un error al validar tu información, por favor intentalo de nuevo",
            error: true
        })
    }

    //Mostrar formulario para modificar la contraseña
    

}

const nuevoPassword = (req, res) =>{
    
}



const registrar =  async (req, res)=> {
    
    //Validacion
    await check('nombre').notEmpty().withMessage('El nombre no puede ir vacio').run(req)
    await check('email').isEmail().withMessage('No es un email').run(req)
    await check('password').isLength({ min: 6 }).withMessage("La contraseña debe tener minimo 8 caracteres").run(req)

    await check('repetir_password').equals(req.body.password).withMessage("La contraseña no es igual").run(req)

    let resultado = validationResult(req) 
    
    if (!resultado.isEmpty()) {
        return res.render('auth/registro',{
            pagina: "Crear cuenta",
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario:{
                nombre: req.body.nombre,
                email: req.body.email
            }

        })
    }
    //Extraer datos

    const { email , nombre, password} = req.body

    //Verificar el correo
    const existeCorreo = await Usuario.findOne( {where: { email }})
    if (existeCorreo) {
        return res.render('auth/registro',{
            pagina: "Crear cuenta",
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario ya esta registrado'}],
            usuario:{
                nombre: req.body.nombre,
                email: req.body.emaill
            }

        })
    }


    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarID()
    })

    //Email de confirmación
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    //Mostrar mensaje de confirmación 
    return res.render('templates/mensaje',{
        pagina: "Cuenta creada correctamente",
        mensaje: "Hemos enviado un Email de confirmación",

    })
    
}

//Funcion que comprubea la cuenta
const confirmar = async (req, res) =>{
    const {token} = req.params
    //Verificr si el token es válido
    const usuario = await Usuario.findOne({where: {token}})
    //Confirmar el email
    if (!usuario) {
        return res.render('auth/confirmarCuenta',{
            pagina: "Error al confirmar la cuenta",
            mensaje: "Hubo un error al confirmar tu cuenta, intenta de nuevo",
            error: true
        })
    }
    usuario.token = null
    usuario.confirmado = true
    console.log(usuario)
    await usuario.save()
    return res.render('auth/confirmarCuenta',{
        pagina: "Cuenta Confirmada",
        mensaje: "La cuenta se confirmo correctamente",
    })
}


export {
    formularioLogin,
    registrar,
    formularioRegistro,
    recuperarPassword,
    confirmar,
    restablecerPassword,
    nuevoPassword,
    comprobarToken
}