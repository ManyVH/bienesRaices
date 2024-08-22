import nodemailer from 'nodemailer'

const emailRegistro = async(datos)=>{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });
      const {email, nombre, token} = datos
      
      //Enviar email
      await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: "Confirmación de cuenta",
        text: 'Confirma tu cuenta en bienes raices',
        html: ` 
          <p>Hola ${nombre}, por favor puedes confirmar tu cuenta en el siguiente enlace:</p>
          <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmarCuenta/${token}">Confirmar cuenta</a>
          <p>Si esta cuenta fue por error ignora el correo</p>
        `
      })
}



const emailRecuperarPassword = async(datos)=>{
  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    const {email, nombre, token} = datos
    
    //Enviar email
    await transport.sendMail({
      from: 'BienesRaices.com',
      to: email,
      subject: "Restablecer tu contraseña ",
      text: 'Restablecer contraseña',
      html: ` 
        <p>Hola ${nombre}, Solicitaste recuperar tu contraseña:</p>
        <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/recuperarPassword/${token}">Restablecer contraseña</a>
        <p>Si tu no solicitaste este cambio ignora el correo</p>
      `
    })
}
export{
    emailRegistro,
    emailRecuperarPassword
}