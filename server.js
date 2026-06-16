const express = require('express')
require('dotenv').config()
require('./workers/emailWorker')   // arranca el worker
const emailQueue = require('./queues/emailQueue')

const app = express()
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.post('/api/send-email', async (req, res) => {
  const { correo, mensaje, nombre, apellido, celular } = req.body

  if (!correo || !mensaje || !mensaje || !nombre || !apellido) {
    return res.status(400).json({ error: 'Faltan campos' })
  }

  await emailQueue.add(
    { correo, mensaje, nombre, apellido, celular },
    {
      attempts: 3,      // reintenta 3 veces si falla
      backoff: 5000     // espera 5 segundos entre intentos
    }
  )

  res.json({ ok: true, message: 'Email en cola' })
})

app.listen(3001, () => {
  console.log('Backend corriendo en :3001')
})