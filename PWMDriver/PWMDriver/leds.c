#include <avr/io.h>
#include <util/delay.h>
#include "leds.h"


void startup_animation()
{
	
	for(int i = 0; i < 3; i++)
	{
		WHITE_ON;
		_delay_ms(100);
		
		ORANGE_ON;
		_delay_ms(100);
		
		BLUE_ON;
		_delay_ms(100);
		
		WHITE_OFF;
		_delay_ms(100);
		
		ORANGE_OFF;
		_delay_ms(100);
		
		BLUE_OFF;
		_delay_ms(100);
	}
}

void init_leds()
{
	DDRD |= 1 << DDRD4;		//Enable output for orange LED
	DDRD |= 1 << DDRD2;		//Enable output for white LED
	DDRE |= 1 << DDRE0;		//Enable output for blue LED
}
