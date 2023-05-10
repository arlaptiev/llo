#include <SPI.h>
#include <MFRC522.h>
#include <Keyboard.h>
#include <MD_Parola.h>
#include <MD_MAX72xx.h>
#include <RotaryEncoder.h> // include rotary encoder library
RotaryEncoder encoder(A0, A1);

/////////////////////////////////////////////////////////////////// RFID
#define RST_PIN         9          // RFID / NFC Reset Pin
#define SS_PIN          10         // RFDI / NFC Slave Select Pin
MFRC522 rfid(SS_PIN, RST_PIN);
byte authorizedUID[7] = {0x04, 0x23, 0x8A, 0xDE, 0x70, 0x00, 0x00}; // RFID / NFC Card UID

/////////////////////////////////////////////////////////////////// Keyboard variables
#define OFF             0
#define ON              1
static int rotaryPos = 0;
bool keyA = OFF;
bool keyC = OFF;
bool keyD = OFF;

/////////////////////////////////////////////////////////////////// Display
#define HARDWARE_TYPE MD_MAX72XX::FC16_HW
#define MAX_DEVICES     4         // Number of connected devices
#define CS_PIN          8         // DIN pin of MAX7219 module
String displayText = "Hello World!";
MD_Parola myDisplay = MD_Parola(HARDWARE_TYPE, CS_PIN, MAX_DEVICES);


///////////////////////////////////////////////////////////////// RFID
void setupRFID() {
  SPI.begin(); // Init SPI bus
  mfrc522.PCD_Init(); // Init MFRC522
  delay(4); // Optional delay. Some board do need more time after init to be ready, see Readme
}

void loopRFID() {
  // Reset the loop if no new card present on the sensor/reader. Select one of the cards
  if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
    bool authorized = true; // flag to indicate if the card is authorized

    // Check if the card UID matches the authorized UID
    for (int i = 0; i < mfrc522.uid.size; i++) {
      if(mfrc522.uid.uidByte[i] != authorizedUID[i]) {
        authorized = false;
      }
    }

    // If the card is authorized, send message
    if (authorized) {
      Keyboard.write(83); // S
    }
  }
}


///////////////////////////////////////////////////////////////// Keyboard
void setupKeyboard() {
  Keyboard.begin();
  pinMode(4, INPUT_PULLUP);
  pinMode(5, INPUT_PULLUP);
}


void loopRotaryEncoder() {
  encoder.tick();

  int newPos = encoder.getPosition();
  if (rotaryPos != newPos) {
    if (newPos > rotaryPos) {
      Keyboard.write(60); // <
    }
    if (newPos < rotaryPos) {
      Keyboard.write(62); // >
    }
    rotaryPos = newPos;
  }
}


void loopButtons() {
  if ((digitalRead(4) == HIGH) && keyC == OFF) {
    keyC = ON;
    Keyboard.write(80); // P
  }
  if (digitalRead(4) == LOW) {
    keyC = OFF;
  }

  if ((digitalRead(3) == HIGH) && keyD == OFF) {
    keyD = ON;
    Keyboard.write(81); // Q
  }
  if (digitalRead(3) == LOW) {
    keyD = OFF;
  }
}


///////////////////////////////////////////////////////////////// Display
void setupDisplay() {
  myDisplay.begin();
  myDisplay.setIntensity(4);
  myDisplay.displayClear();
  myDisplay.displayScroll(displayText, PA_CENTER, PA_SCROLL_LEFT, 200);
}

void loopDisplay() {
  // Check if there is any text to display
  if (Serial.available() > 0) {
    String serialRead = Serial.readString();  // read until timeout
    serialRead.trim();                        // remove any \r \n whitespace at the end of the String

    // Update the display text if the message starts with a $
    if (serialRead[0] == '$') {
      displayText = serialRead.substring(1);
    }
  }

  // Keep display animation running
  if (myDisplay.displayAnimate()) {
    myDisplay.displayReset();
  }
}


///////////////////////////////////////////////////////////////// Main
void setup() {
  // initialize serial communication:
  Serial.begin(115200);
  while (!Serial); // Do nothing if no serial port is opened (added for Arduinos based on ATMEGA32U4)

  setupRFID();
  setupKeyboard();
  setupDisplay();
}


void loop() {
  loopRFID();
  loopDisplay();
  loopRotaryEncoder();
  loopButtons();
}
