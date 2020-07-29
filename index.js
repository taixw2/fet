/* eslint-disable no-undef */
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/production.min.js')
} else {
  module.exports = require('./dist/development.js')
}
