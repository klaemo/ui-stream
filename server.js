'use strict'

const dgram = require('dgram')

const express = require('express')
const UAParser = require('ua-parser-js')

const Decoder = require('./decode-buffer')
const fs = require('fs')
const WebSocketServer = require('ws').Server
const wss = new WebSocketServer({ port: 3001 })

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data, { binary: true }, function(err) {
      if (err) return console.error(err)
    })
  })
}

const app = express()

const UDP_PORT = 3336
const UDP_ADDR = '141.76.67.198'

// serve the client
app.use(express.static('client'))

const server = app.listen(process.env.PORT || 3000, function() {
  var host = server.address().address
  var port = server.address().port

  console.log('HTTP Server listening at http://%s:%s', host, port)
})

// const primus = new Primus(server, { parser: 'binary' })
const decoder = new Decoder()
const udp = dgram.createSocket('udp4')
const uaparser = new UAParser()
const osc = require('node-osc')

// "connect"
const oscClient = new osc.Client(UDP_ADDR, UDP_PORT - 1)
oscClient.send('hello')

function logUA(string) {
  const ua = uaparser.setUA(string).getResult()
  return [ua.os.name, ua.os.version, ua.browser.name, ua.browser.version].join(' ')
}

wss.on('connection', function(spark) {
  console.log('client connected:', logUA(spark.upgradeReq.headers['user-agent']))
})

wss.on('close', function () {
  console.log('client disconnected')
})

var start = Date.now()
var count = 0

function measureFps() {
  count++
  var diff = Date.now() - start
  if (diff > 2000) {
    console.log(Math.round(count / diff * 1000) + 'fps')
    count = 0
    start = Date.now()
  }
}

// test mode
if (process.env.NODE_ENV === 'test') {
  const img = fs.readFileSync('client/test.jpg')
  setInterval(function() {
    wss.broadcast(img)
    measureFps()
  }, 1000 / 70)
}

// broadcast images to all connected clients
decoder.on('image', function(buf) {
  wss.broadcast(buf)
  measureFps()
})


udp.on('listening', function() {
  let address = udp.address()
  console.log('UDP socket on ' + address.address + ':' + address.port)
})

udp.on('message', function(message) {
  decoder.decode(message)
})

udp.on('error', console.error.bind(console))
udp.bind(UDP_PORT, function() {
  console.log('UDP bound to port', UDP_PORT)
})
