"use strict";

const fs = require("fs");
const http = require("http");
const socketIO = require('socket.io');

module.exports = function (stream, topic) {
  var app = http.createServer(function(req, res) {
    fs.readFile(__dirname + '/index.html', function (err, data) {
      if (err) {
        res.writeHead(500);
        res.end('Something went terribly wrong.');
      }
      res.writeHead(200);
      res.end(data);
    });
  }).listen(8111);
  var io = socketIO(app);
  io.on('connection', (socket) => {
    socket.emit('topic', topic);
    stream.on('data', (event) => {
      socket.emit('tweet', event.text);
    });
  });
}
