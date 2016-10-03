#include <avr/io.h>
#include "pwm.h"
#include "serial.h"

void pwm_init()
{
	//Time 0 PWM set up
	TCCR0A = _BV(COM2A1) | _BV(COM2B1) | _BV(WGM21) | _BV(WGM20); //Enable non inverting 8-Bit Fast PWM on A and B
	TCCR0B = _BV(CS20); //clock without any prescaler
	
	//Timer 1 PWM set up
	TCCR1A = _BV(COM1A1) | _BV(COM1B1) | _BV(WGM10);
	TCCR1B = _BV(WGM12) | _BV(CS10);
	
	//Timer 2 PWM set up
	TCCR2A = _BV(COM2A1) | _BV(COM2B1) | _BV(WGM21) | _BV(WGM20); //Enable non inverting 8-Bit Fast PWM on A and B
	TCCR2B = _BV(CS20); //clock without any prescaler
		
	DDRB |= _BV(PORTB1) | _BV(PORTB2) | _BV(PORTB3);  //Enable output for OC1 and OC2A
	DDRD |= _BV(PORTD3) | _BV(PORTD5) | _BV(PORTD6);  //Enable output for OC0 and OC2B

	//TODO: [ML] Add initialization code to keep them all off;
}

void set_channel(uint8_t channel, uint8_t val)
{	
	if(channel == 0)
	{
		OCR0A = val;
	}
	else if (channel == 1)
	{
		OCR0B = val;
	}
	else if (channel == 2)
	{
		OCR1A = val;
	}
	else if (channel == 3)
	{
		OCR1B = val;
	}
	else if (channel == 4)
	{
		OCR2A = val;
	}
	else if (channel == 5)
	{
		OCR2B = val;
	}
	
}

void set_all_channels(uint8_t val)
{
	OCR0A = val;
	OCR0B = val;
	OCR1A = val;
	OCR1B = val;
	OCR2A = val;
	OCR2B = val;	
}

uint8_t read_channel(uint8_t channel)
{
	uint8_t val = 0;
	
	if(channel == 0)
	{
		val = OCR0A;
	}
	else if (channel == 1)
	{
		val = OCR0B;
	}
	else if (channel == 2)
	{
		val = OCR1A;
	}
	else if (channel == 3)
	{
		val = OCR1B;
	}
	else if (channel == 4)
	{
		val = OCR2A;
	}
	else if (channel == 5)
	{
		val = OCR2B;
	}
	
	return val;
}

void read_all_channels(uint8_t *vals)
{
	vals[0] = OCR0A;
	vals[1] = OCR0B;
	vals[2] = OCR1A;
	vals[3] = OCR1B;
	vals[4] = OCR2A;
	vals[5] = OCR2B;
}