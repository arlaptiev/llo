
const { ipcRenderer } = require("electron");

// Serial Port
const { SerialPort } = require('serialport')
var sp = null;



// Initialize variables
var c;
var response;




// GPT Connection via OpenAI NodeJS
//////////////////////////////////////////////////////////////////
//https://useems.github.io/openai-nodejs/index.html
const OpenAI = require('openai-nodejs');
const client = new OpenAI(OPENAI_API_KEY);


// Get a color when app is first loaded
let prompt = "the hex code for color 'bright pink' is";
let startColor;

client.complete(prompt, { stop: ['\n', '"'], temperature: 0 })
    .then(completion => {
        console.log(`Result: ${prompt}${completion.choices[0].text}`);

        // Grab string from the array
        startColor = completion.choices[0].text;

        // Remove spaces from the string
        startColor = trim(startColor);

        // Remove single quotes from the string
        startColor = startColor.replace(/'/g, '');

        //remove period from the string
        startColor = startColor.replace(/\./g, '');

        // update background color
        c = color(startColor);

    })
    .catch(console.error);




// Get a new color when user presses a key
function getColor(_color) {

    let prompt = "The hex code for the color '" + _color + "':";
    var newColor;

    client.complete(prompt, { stop: ['\n', '"'], temperature: 0 })
        .then(completion => {
            console.log(`Result: ${prompt}${completion.choices[0].text}`);

            // grab string from the array and clean it up
            newColor = completion.choices[0].text;
            newColor = trim(newColor);
            newColor = newColor.replace(/'/g, '');
            newColor = newColor.replace(/\./g, '');

            // update background color
            c = color(newColor);
            console.log(newColor);
        })
        .catch(console.error);

}



// SERIAL PORT
//////////////////////////////////////////////////////////////////
// https://serialport.io/docs/guide-usage

// to list serial port, use these commands in terminal:
// ls /dev/tty.*
// ls /dev/cu.*

sp = new SerialPort({ path: '/dev/tty.usbmodem14201', baudRate: 115200 });
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




// MAIN APP
//////////////////////////////////////////////////////////////////
function setup() {
    createCanvas(200, 200);

    c = color('#bbbbbb');   //start w/ a grey background, until we get a color from openai

    response = "hi";
}



function draw() {
    background(c);  //update background color

    // Display color
    textSize(20);
    fill(255, 255, 255);
    text(c, 10, 30);

    // Display response from Arduino
    textSize(20);
    fill(255, 255, 255);
    text(response, 10, 100);

}



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


