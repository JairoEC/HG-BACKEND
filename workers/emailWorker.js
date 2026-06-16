const emailQueue = require('../queues/emailQueue')
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

emailQueue.process(async (job) => {
  const { correo, mensaje, nombre, apellido, celular } = job.data
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `${nombre} ha solicitado una cotizacion`,
    html:`
    <p>Información del cliente interesado:</p>
    <ul>
        <li>Nombre: ${nombre} ${apellido}</li>
        <li>Celular: ${celular}</li>
        <li>Correo: ${correo}</li>
    </ul>
    <hr/>
    <strong>MENSAJE DEL CLIENTE INTERESADO:</strong>
    <p>${mensaje}</p>
    <hr/>
    `
  })
  console.log(`Email enviado. Usuario ${correo} quiere cotizacion`)
})

emailQueue.on('failed', (job, err) => {
  console.log(`Email falló a ${job.data.correo}: ${err.message}`)
})