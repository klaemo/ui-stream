'use strict'

const ntohl = require('network-byte-order').ntohl

module.exports = Decoder

function Decoder() {
  this.mNumCompleteImagesReceived = 0
  this.mImageSeqNum = -1
  this.mFirstImageSeqNum = -1
  this.lastImageSeqNum = -1
  this.mLastPacketNum = -1
  this.bytesWritten = 0

  this.mJPEGData = []
}

// mix in event emitter
Decoder.prototype = Object.create(require('events').EventEmitter.prototype)

Decoder.prototype.decode = function(buf) {
  if (ntohl(buf, 0) === -559038737) {
    this._handleImagePacket(buf)
  }

  return this
}

Decoder.prototype._handleImagePacket = function(data) {
  // var lastImageSeqNum = this.mImageSeqNum
  this.mImageSeqNum = ntohl(data, 4)

  var frameSize = ntohl(data, 8)
  var packetCount = ntohl(data, 12)
  var packetLen = ntohl(data, 16)

  // first image
  if (this.mFirstImageSeqNum === -1) {
    this.mFirstImageSeqNum = this.mImageSeqNum
    console.log('first image', this.mFirstImageSeqNum)
  }

  if (packetCount === 0) {
    this.bytesWritten = 0
    this.mLastPacketNum = -1
    this.mJPEGData = []
  }

  // if (this.mLastPacketNum === packetCount - 1 || lastImageSeqNum === this.mImageSeqNum) {
  this.mJPEGData.push(data.slice(20))
  this.mLastPacketNum++
  this.bytesWritten += packetLen
  // }

  // image complete
  if (this.bytesWritten === frameSize) {
    this.mNumCompleteImagesReceived++
    this.emit('image', Buffer.concat(this.mJPEGData), this.bytesWritten)
  }
}
