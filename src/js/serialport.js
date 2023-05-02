// Serial Port
const { SerialPort } = require('serialport');

// Initialize variables
let response;

// SERIAL PORT
//////////////////////////////////////////////////////////////////
// https://serialport.io/docs/guide-usage

// to list serial port, use these commands in terminal:
// ls /dev/tty.*
// ls /dev/cu.*

const sp = new SerialPort({ path: '/dev/tty.usbmodem14201', baudRate: 115200 });
sp.open(function (err) {
    if (err) {
        return console.log(err.message)
    }
})

// The open event is always emitted
sp.on('open', function () {
    // open logic
    console.log("Serial Port Opened");
})


// Write data to serial port 
function sendToArduino(data) {
    sp.write(data);
}


// Read data from serial port
sp.on('data', function (data) {
    console.log(data[0])    // print data to console
    response = data[0];     // write it to response so we can show on canvas
})


// KEYBOARD INPUT
//////////////////////////////////////////////////////////////////
function keyPressed() {

  if (key == 'A' || key == 'a') {
      getColor("fire red");
  }
  if (key == 'B' || key == 'b') {
      getColor("morning sky");
  }

  if (key == 'L' || key == 'l') {
      sendToArduino('L');
  }

  if (key == 'H' || key == 'h') {
      sendToArduino('H');
  }

}