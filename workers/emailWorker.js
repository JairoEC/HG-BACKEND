const emailQueue = require('../queues/emailQueue')
const { Resend } = require('resend')

const resend = new Resend(process.env.RESEND_API_KEY)

emailQueue.process(async (job) => {
  const { correo, mensaje, nombre, apellido, celular } = job.data

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL, // ej: 'onboarding@resend.dev' o 'contacto@stackpe.dev'
    to: process.env.EMAIL_USER,          // tu Gmail, donde recibes la notificación
    subject: `${nombre} ha solicitado una cotizacion`,
    html: `
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

  if (error) {
    // Lanzamos el error para que Bull lo capture y dispare 'failed' / reintentos
    throw new Error(error.message || JSON.stringify(error))
  }

  console.log(`Email enviado. Usuario ${correo} quiere cotizacion. ID: ${data?.id}`)
})

emailQueue.on('failed', (job, err) => {
  console.log(`Email falló a ${job.data.correo}: ${err.message}`)
})