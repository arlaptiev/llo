
const { ipcRenderer } = require("electron"); // ipcRenderer is used to send messages to the main process

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


// MAIN APP
//////////////////////////////////////////////////////////////////

const chat = new MusicChat();
const player = new Player();

class Controller {
    constructor() {
        this.runOnce = true
    }

    loop() {
        if (player.ready) {
            player.setVolume(1);
            player.play('Cromby - Gigolo');
            this.runOnce = false;
        }
    }
}

var c;
let controller;

function setup() {
    controller = new Controller();

    createCanvas(200, 200);

    c = color('#bbbbbb');   //start w/ a grey background, until we get a color from openai

    response = "hi";
}



function draw() {
    controller.loop();

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




