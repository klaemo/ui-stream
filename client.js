/*global performance*/
'use strict'

var applyTransform = require('transform-style')

var canvas = document.querySelector('[data-hook="canvas"]')
var btn = document.querySelector('[data-hook="toggle-running"]')
var timing = document.querySelector('[data-hook="timing"]')
var fps = document.querySelector('[data-hook="fps"]')
var receive = document.querySelector('[data-hook="receive"]')
var context = canvas.getContext('2d')

var img = new Image()

var ws
var running = true

btn.addEventListener('click', function(evt) {
  event.preventDefault()

  if (running) {
    ws.close()
    evt.target.textContent = 'Start'
  } else {
    startStream()
    evt.target.textContent = 'Stop'
  }
  running = !running
})

var ticking = false
var times = []
var frames = 0
var startFps = Date.now()

var mime = {'type': 'image\/jpeg'}

var ratioX = window.innerWidth / canvas.width
var ratioY = window.innerHeight / canvas.height
var ratio = Math.min(ratioX, ratioY)
console.log('Scale Ratio', ratio)
applyTransform(canvas, 'scale(' + ratio + ')')

var frameStart = Date.now()
var frameDelta = 0

function requestElementUpdate(data) {
  if (!ticking) {
    requestAnimationFrame(function() {
      var start = performance.now()
      img.onload = function() {
        context.drawImage(img, 0, 0, 1920, 1080)
        window.URL.revokeObjectURL(this.src)

        if (times.length < 30) {
          times.push(performance.now() - start)
        } else {
          timing.textContent = (times.reduce(function (a, b) { return a + b }) / times.length).toFixed(2) + 'ms'
          times = []
        }

        frames++
        var diff = Date.now() - startFps
        if (diff > 1000) {
          receive.textContent = frameDelta + 'ms'
          fps.textContent = (frames / diff * 1000).toFixed(2) + 'fps'
          frames = 0
          startFps = Date.now()
        }
        ticking = false
      }

      img.src = window.URL.createObjectURL(new Blob([data], mime))
    })
  }
  ticking = true
}

function startStream() {
  ws = new WebSocket('ws://localhost:3001')
  ws.binaryType = 'arraybuffer'
  ws.onmessage = function (msg) {
    var now = Date.now()
    frameDelta = now - frameStart
    frameStart = now
    requestElementUpdate(msg.data)
  }
}

startStream()
