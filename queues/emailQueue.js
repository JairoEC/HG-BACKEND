const Bull = require('bull')

const emailQueue = new Bull('emails', {
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: 6379
  }
})

module.exports = emailQueue