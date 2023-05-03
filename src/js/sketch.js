
const { ipcRenderer } = require("electron"); // ipcRenderer is used to send messages to the main process

// MAIN APP
//////////////////////////////////////////////////////////////////

const chat = new MusicChat();
const player = new Player();
let controller; // controller object
let c; // background color
let error = ''; // error message
let errorDrawn = false; // error message drawn

class Controller {
    constructor() {
        this.runOnce = true;

        this.properties = ["5^c!@3b4$6"];
        this.displayedPropertyIdx = 0;
        this.fuckPropertyDisplay = true

        this.trackStr = 'f%$#k';
        this.fuckTrackStrDisplay = true;

        this.mode = 'PLAY'; // vs QUEUE
        this.state = 'IDLE';

        this.turning_speed = 0;
        this.start_time;
        // this.TRANSITION_TRACK_TIME;
        this.rotate_property_time;

        // constants
        this.ROTATE_PROPERTY_TIMEOUT = 6000;
    }

    loop() {
        // check for user updates

        switch (this.state) {
            case 'IDLE':
                if (this.runOnce) {
                    this.start_time = Date.now() + 5000;
                    this.runOnce = false;
                }
                if (Date.now() > this.start_time) {
                    this.state = 'START';
                }
            case 'START':
                // start
                this.start()

                // change state
                this.state = 'FLOW';

            case 'FLOW':
                // check for CHANGE_PROPERTY event
                if (Date.now() > this.rotate_property_time) {
                    this.rotateProperty();
                }

                // check for TRANSITION_TRACK event
                // if (Date.now() > this.TRANSITION_TRACK_TIME) {
                //     this.transitionTrack();
                // }

        }
    }

    async start() {
        // get track
        this.trackStr = await chat.getInitialRecommendation();

        // get properties
        this.properties = await chat.getProperties(this.trackStr);

        // play track
        await player.start(this.trackStr);

        // finish display idle
        this.fuckTrackStrDisplay = false
        this.fuckPropertyDisplay = false

        // set properties display timeout
        this.rotate_property_time = Date.now() + this.ROTATE_PROPERTY_TIMEOUT;
    }

    async transitionTrack(propertyDecision) {
        // get selected property
        const chosenProperty = this.properties[this.displayedPropertyIdx];

        // display transition
        this.fuckTrackStrDisplay = true
        this.fuckPropertyDisplay = true

        // get new track
        this.trackStr = await chat.getRecommendation(this.trackStr, chosenProperty, propertyDecision);

        // get new properties
        this.properties = await chat.getProperties(this.trackStr);

        // set ROTATE PROPERTY event
        this.rotate_property_time = Date.now() + this.ROTATE_PROPERTY_TIMEOUT;

        // transition track
        await player.transitionTrack(this.trackStr);

        // finish display transition
        this.fuckTrackStrDisplay = false
        this.fuckPropertyDisplay = false

        // set properties display timeout
        // this.TRANSITION_TRACK_TIME = Date.now() + 999999999999999; // cancel timeout
    }

    async rotateProperty() {
        // update property display
        this.displayedPropertyIdx = (this.displayedPropertyIdx + 1) % this.properties.length;

        // set ROTATE PROPERTY event
        this.rotate_property_time = Date.now() + this.ROTATE_PROPERTY_TIMEOUT;
    }
}


function setup() {
    controller = new Controller();

    createCanvas(400, 200);

    c = color(119, 90, 232);   //start w/ a grey background, until we get a color from openai

    response = "hi";
}



function draw() {
    controller.loop();
    // console.log(controller.trackStr)
    // console.log(controller.properties[controller.displayedPropertyIdx])

    background(c);  //update background color

    // Display track name
    textSize(20);
    fill(255, 255, 255);
    if (controller.fuckTrackStrDisplay) {
        // get random track string
        text(getRandomWeirdString(getRandomInt(7, 12)) + ' - ' + getRandomWeirdString(getRandomInt(4, 7)), 10, 30);
    } else {
        text(controller.trackStr, 10, 30);
    }

    // Display property
    textSize(20);
    fill(255, 255, 255);
    if (controller.fuckPropertyDisplay) {
        // get random track string
        text(getRandomWeirdString(getRandomInt(5, 10)), 10, 100);
    } else {
        text(controller.properties[controller.displayedPropertyIdx], 10, 100);
    }

    // Display error
    textSize(10);
    fill(255, 150, 150);
    text(error, 10, 170);
    if (error) {
        if (errorDrawn) {
            // pause after error drawn
            debugger;
        }
        errorDrawn = true;
    }
}


/**
 * HELPERS
 */
function getRandomWeirdString(n) {
    const weirdChars = "⨕⫸⪦ꕣ⊢⫷⋕⧔⩩⫻⩑⊝⪮⧈⫳⊓⨴⊦⧑⨳⧞⫿⊠⋃⧉⪥⫺⊔⫹⩇⊬⩂⪲⪵⪫⨯⪭⧝⪸⊍⩘⋉⊱⫢⊞⪯⨩⨹⊣⪱⪴⊨⧡⫻⫷";
    let result = "";
    for (let i = 0; i < n; i++) {
      result += weirdChars[Math.floor(Math.random() * weirdChars.length)];
    }
    return result;
  }

function getRandomInt(low, high) {
    return Math.floor(Math.random() * (high - low + 1)) + low;
}
  

