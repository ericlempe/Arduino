const path = require('path');
const express = require('express');
const http = require('http');
const SocketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = SocketIo.listen(server);
var request = require('request');

// settings

// routes
app.get('/coord', (req, res) => {
  res.sendFile(__dirname +'/index.html');
});

// static files
app.use(express.static(path.join(__dirname, 'public')));

const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const parser = new Readline();

const mySerial = new SerialPort('COM3', {
  baudRate: 9600
});

mySerial.pipe(parser);

mySerial.on('open', function () {
  console.log('Opened Port.');
});

mySerial.on('data', function (data) {
  // console.log(parseInt(data));
  console.log(data.toString());
  var arduino = data.toString();
  var profissional, local;
  if (arduino == 1) {
    profissional = 1;
    local = 1;
  }else if(arduino == 2) {
    profissional = 2;
    local = 1;
  }
  
  request.post('http://144.202.36.206/locais/getCoordenadas', {
    form:{
      profissional: profissional,
      local: local
  }
})
  io.emit('arduino:data', {
    value: data.toString()
  });
});

mySerial.on('err', function (data) {
  console.log(err.message);
});

server.listen(3000, () => {
  console.log('Server on port 3000');});
