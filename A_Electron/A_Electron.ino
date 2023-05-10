#include <SPI.h>
#include <MFRC522.h>
#include <Keyboard.h>
#include <MD_Parola.h>
#include <MD_MAX72xx.h>
#include <RotaryEncoder.h>        // include rotary encoder library
RotaryEncoder encoder(A0, A1);

#define RST_PIN         9          // RFID / NFC Reset Pin
#define SS_PIN          10         // RFDI / NFC Slave Select Pin

int incomingByte;                  // a variable to read incoming serial data into
byte authorizedUID[7] = {0x04, 0x23, 0x8A, 0xDE, 0x70, 0x00, 0x00}; // RFID / NFC Card UID

MFRC522 mfrc522(SS_PIN, RST_PIN);  // Create RFID MFRC522 instance

void setup()
{
  // initialize serial communication:
  Serial.begin(115200);
  while (!Serial); // Do nothing if no serial port is opened (added for Arduinos based on ATMEGA32U4)

  /* RFID */
  SPI.begin(); // Init SPI bus
  mfrc522.PCD_Init(); // Init MFRC522
  delay(4); // Optional delay. Some board do need more time after init to be ready, see Readme

  // initialize the LED pin as an output:
  pinMode(ledPin, OUTPUT);
}

void loop()
{
  // see if there's incoming serial data:
  if (Serial.available() > 0)
  {
    // read the oldest byte in the serial buffer:
    incomingByte = Serial.read();
    // if it's a capital H (ASCII 72), turn on the LED:
    if (incomingByte == 'H')
    {
      digitalWrite(ledPin, HIGH);

      // Response back to Electron app
      Serial.write(10);
    }
    // if it's an L (ASCII 76) turn off the LED:
    if (incomingByte == 'L')
    {
      digitalWrite(ledPin, LOW);

      // Response back to Electron app
      Serial.write(9);
    }
  }


  /* RFID */
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
      Serial.println("Authorized");
      Serial.write(10);
    }
  }
}
