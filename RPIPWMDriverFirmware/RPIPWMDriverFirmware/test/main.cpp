#include <Arduino.h>
#include <Wire.h>
#include <PCA9685.h>
#include <WString.h>

#define PURPLE_LED 5  // AVR pin 14
#define ORANGE_LED 6  // AVR pin 12
#define BLUE_LED 8    // AVR pin 11

#define STATUS_LED PURPLE_LED

#define ENABLE_TIMER_1 TIMSK1 |= (1 << OCIE1A)
#define DISABLE_TIMER_1 TIMSK1 &= ~(1 << OCIE1A)



void processCommand(String command);
void toggleLED(uint8_t LED);
void setImmediate(int channel, long value);
void setImmediate(long* values);
void fadeFixedTime(long* values);
/*
void fadeVariableTime(uint8_t duration, long* values);
*/

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

void setup() {
	pinMode(PURPLE_LED, OUTPUT);
	pinMode(ORANGE_LED, OUTPUT);
	pinMode(BLUE_LED, OUTPUT);

	Serial.begin(9600);
	pwm.begin();
	pwm.setFrequency(90);
	digitalWrite(STATUS_LED, HIGH);
	
	// initialize timer1
	noInterrupts();           
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

void loop() {

	if (Serial.available() > 0) {
		b = Serial.read();
		str += b;
		
		#ifdef DEBUG
		Serial.print(b);
		#endif
		
		if (b==13)
		{
			#ifdef DEBUG
			Serial.println();
			#endif
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
			#ifdef DEBUG
			Serial.println("Fading complete");
			#endif
		}
		
	}	
}

/* 

	Commands
	p - Toggle the purple LED
		input:  None
		output: None
	o - Toggle the orange LED
		input:  None
		output: None
	b - Toggle the blue LED
		input:  None
		output: None
	s -	Set channel immediate 
		input:  s{channel}v{value}
		output: None		
	r - Read channel value 
		input:  r{channel}
		output: c{channel}v{value}
	i - Set all channels immediately 
		input:  i{[comma separated values]}
		output: None
	a - Set all channels to specified value
		input:	a{value}
		output: None
	f - Fade channels to specified values
		input:	f{[comma separated values]}
		output: None
	
	
	Pending commands
	ph
	temp
	waterlevel		

*/
void processCommand(String command)
{
	char prefix = command.charAt(0);
	
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
		#ifdef DEBUG
		Serial.print("Reading pin ");
		Serial.println(pin);
		#endif
		long val = pwm.readChannel(pin);
		Serial.print("c");
		Serial.print(pin)
		Serial.print("v")
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
				newSettings[j++] = buff.toInt();
				buff = "";
			}
			b = command.charAt(++i);
		}
		newSettings[j++] = buff.toInt();
		
		setImmediate(newSettings);		
	}
	else if (prefix == 'a'){
		uint8_t val = command.substring(1).toInt();
		DISABLE_TIMER_1;
		pwm.setAll(val);
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
				newSettings[j++] = buff.toInt();
				buff = "";
			}
			b = command.charAt(++i);
		}
		newSettings[j++] = buff.toInt();
		
		fadeFixedTime(newSettings);
	}
	else {
		Serial.println("ERR: Command not recognized");
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

/*
void fadeVariableTime(uint8_t duration, long* values)
{
	
}
*/

ISR(TIMER1_COMPA_vect)          // timer compare interrupt service routine
{
	//
	toggleLED(ORANGE_LED);
	timer_flag = true;
}
