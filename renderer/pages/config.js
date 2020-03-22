import moment from 'moment'

// determin environment
const env = process.argv.reduce((prev, val) => {
  const prefix = '--env='
  if (val.startsWith(prefix)) {
    return val.slice(prefix.length)
  }
  return prev
}, null)

const development = {
  workDuration: moment.duration('00:00:03'),
  breakDuration: moment.duration('00:00:02')
}
const production = {
  workDuration: moment.duration('00:25:00'),
  breakDuration: moment.duration('00:05:00')
}
const config = {development, production}

module.exports = config[env]
