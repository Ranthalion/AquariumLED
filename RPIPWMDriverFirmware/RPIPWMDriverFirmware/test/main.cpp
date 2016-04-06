/*Begining of Auto generated code by Atmel studio */
#include <Arduino.h>

/*End of auto generated code by Atmel studio */

#define PURPLE_LED 5  // AVR pin 14
#define ORANGE_LED 6  // AVR pin 12
#define BLUE_LED 8    // AVR pin 11

#define STATUS_LED 5

#define ENABLE_TIMER_1 TIMSK1 |= (1 << OCIE1A)
#define DISABLE_TIMER_1 TIMSK1 &= ~(1 << OCIE1A)

#include <Wire.h>
#include <PCA9685.h>
#include <WString.h>
//Beginning of Auto generated function prototypes by Atmel Studio
//End of Auto generated function prototypes by Atmel Studio

void processCommand(String command);
void toggleLED(uint8_t LED);
void setImmediate(int channel, long value);
void setImmediate(long* values);
void fadeFixedTime(long* values);
void fadeVariableTime(uint8_t duration, long* values);


volatile bool timer_flag;
uint8_t blueState = LOW;
char b;
PCA9685 pwm = PCA9685(0x60);
byte serialInput[100];
long currentSettings[NUM_CHANNELS];
long newSettings[NUM_CHANNELS];
long delta[NUM_CHANNELS];
byte pos = 0;
String str="";

int main(void)
{

	init();

	setup();
	
	for (;;) {
		loop();
		if (serialEventRun) serialEventRun();
	}
	
	return 0;
}

// the setup function runs once when you press reset or power the board
void setup() {
	// initialize digital pin 13 as an output.
	pinMode(PURPLE_LED, OUTPUT);
	pinMode(ORANGE_LED, OUTPUT);
	pinMode(BLUE_LED, OUTPUT);

	Serial.begin(9600);
	pwm.begin();
	pwm.setFrequency(90);
	digitalWrite(STATUS_LED, HIGH);
	
	// initialize timer1
	noInterrupts();           // disable all interrupts
	TCCR1A = 0;
	TCCR1B = 0;
	TCNT1  = 0;

	OCR1A = 3906;//7812;// 15625;            // compare match register 16MHz/256/2Hz
	TCCR1B |= (1 << WGM12);   // CTC mode
	TCCR1B |= (1 << CS12);    // 256 prescaler
	//TIMSK1 |= (1 << OCIE1A);  // enable timer compare interrupt
	interrupts();             // enable all interrupts
	
	timer_flag = false;
}

// the loop function runs over and over again forever
void loop() {

	// send data only when you receive data:
	if (Serial.available() > 0) {
		// read the incoming byte:
		b = Serial.read();
		str += b;
		Serial.print(b);
		
		if (b==13)
		{
			Serial.println();
			processCommand(str);
			str = "";
		}
	}
	
	if (timer_flag == true)
	{
		bool done = true;
		for(int i = 0; i < NUM_CHANNELS; i++)
		{
			if (currentSettings[i] < newSettings[i])
			{
				currentSettings[i]++;				
				done = false;
			}
			else if (currentSettings[i] > newSettings[i])
			{
				currentSettings[i]--;
				done = false;
			}
		}
	
		pwm.setChannels(currentSettings);
		timer_flag = false;
		
		if (done == true)
		{
			TIMSK1 &= ~(1 << OCIE1A);  // disable timer compare interrupt	
			digitalWrite(ORANGE_LED, LOW);
			Serial.println("Fading complete");
		}
		
	}	
}

void processCommand(String command)
{
	char prefix = command.charAt(0);
	Serial.print("Command received: ");
	
	Serial.println(command);
	
	if (prefix == 'p')
	{
		toggleLED(PURPLE_LED);
	}
	else if (prefix == 'o'){
		toggleLED(ORANGE_LED);
	}
	else if (prefix == 'b'){
		toggleLED(BLUE_LED);
	}
	else if (prefix == 's'){
		uint8_t channel = String(command.charAt(1)).toInt();
		long value = command.substring(3).toInt();
		setImmediate(channel, value);
	}
	else if (prefix == 'r'){
		uint8_t pin = String(command.substring(1)).toInt();
		Serial.print("Reading pin ");
		Serial.println(pin);
		long val = pwm.readChannel(pin);
		
		Serial.println(val);
	}
	else if (prefix == 'i'){
		uint8_t i = 1;
		uint8_t j = 0;
		
		for(j=0; j<NUM_CHANNELS; j++)
		{
			newSettings[j] = 0;
		}
		j = 0;
		
		String buff = "";
		b = command.charAt(i);
		while (b != 13)
		{
			if (b != ',')
			{				
				buff += b;		
			}
			else
			{
				Serial.print("buff = ");
				Serial.println(buff);
				Serial.print(j); 
				Serial.print(" = ");
				newSettings[j++] = buff.toInt();
				Serial.println(newSettings[j-1]);
				buff = "";
			}
			b = command.charAt(++i);
		}
		newSettings[j++] = buff.toInt();
		Serial.print("buff = ");
		Serial.println(buff);
		Serial.print(j);
		Serial.print(" = ");
		Serial.println(newSettings[j-1]);
		
		setImmediate(newSettings);		
	}
	else if (prefix == 'a'){
		uint8_t val = command.substring(1).toInt();
		Serial.print("Setting all to ");
		Serial.println(val);
		DISABLE_TIMER_1;
		pwm.setAll(val);
	}
	else if (prefix == 'e')
	{
		ENABLE_TIMER_1;
	}
	else if (prefix == 'd')
	{
		DISABLE_TIMER_1;
		
	}
	else if (prefix == 'f')
	{
		uint8_t i = 1;
		uint8_t j = 0;
		
		for(j=0; j<NUM_CHANNELS; j++)
		{
			newSettings[j] = 0;
		}
		j = 0;
		
		String buff = "";
		b = command.charAt(i);
		while (b != 13)
		{
			if (b != ',')
			{
				buff += b;
			}
			else
			{
				Serial.print("buff = ");
				Serial.println(buff);
				Serial.print(j);
				Serial.print(" = ");
				newSettings[j++] = buff.toInt();
				Serial.println(newSettings[j-1]);
				buff = "";
			}
			b = command.charAt(++i);
		}
		newSettings[j++] = buff.toInt();
		Serial.print("buff = ");
		Serial.println(buff);
		Serial.print(j);
		Serial.print(" = ");
		Serial.println(newSettings[j-1]);
		
		fadeFixedTime(newSettings);
	}
	else {
		Serial.println("Command not recognized");
	}
	
}

void toggleLED(uint8_t LED)
{
	digitalWrite(LED, (!digitalRead(LED)));	
}

void setImmediate(int channel, long value)
{
	DISABLE_TIMER_1;
	pwm.setChannel(channel, value);
}

void setImmediate(long* values)
{
	DISABLE_TIMER_1;
	pwm.setChannels(values);
}

void fadeFixedTime(long* values)
{
	for(int i = 0; i < NUM_CHANNELS; i++)
	{
		currentSettings[i] = pwm.readChannel(i);
	}
	ENABLE_TIMER_1;
}
void fadeVariableTime(uint8_t duration, long* values)
{
	
}

ISR(TIMER1_COMPA_vect)          // timer compare interrupt service routine
{
	//
	toggleLED(ORANGE_LED);
	timer_flag = true;
}
