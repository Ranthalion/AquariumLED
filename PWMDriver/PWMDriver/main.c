#include <avr/interrupt.h>
#include "leds.h"
#include "pwm.h"
#include "serial.h"

//Timer 3 for PWM dimming
#define ENABLE_TIMER TIMSK3 |= _BV(TOIE3)
#define DISABLE_TIMER TIMSK3 &= ~_BV(TOIE3)

volatile uint8_t timer_flag;
volatile uint8_t cnt;
uint8_t currentSettings[6];
uint8_t newSettings[6];
uint8_t delta[6];

void init();


/* 

	Commands
	w - Toggle the white LED
		input:  None
		output: None
	o - Toggle the orange LED
		input:  None
		output: None
	b - Toggle the blue LED
		input:  None
		output: None
	t - Read current temperature
		input: None
		output: current temperature in degrees celcius
	s -	Set channel immediate 
		input:  s{byte channel}{byte value}
		output: None		
	r - Read channel value. If channel is not specified, then all values are returned
		input:  r{channel} or r
		output: c{channel}v{value} or v{values}
	a - Set all channels to specified value
		input:	a{value}
		output: None
	i - Set all channels immediately
		input:  i{[comma separated values]}
		output: None
			
	Pending
	f - Fade channels to specified values
		input:	f{[comma separated values]}
		output: None
	
	Pending commands
	ph
	temp
	waterlevel		

*/
int main(void)
{
	init();
	
    while (1) 
    {
		
		if (idx > 2 && (commandBuffer[idx - 2] == 13 || commandBuffer[idx-1] == 10))
		{
			char cmd = commandBuffer[0];
			
			if (cmd == 'e')
			{
				ENABLE_TIMER;
			}
			else if (cmd == 'd')
			{
				DISABLE_TIMER;
				BLUE_OFF;
			}
			else if (cmd == 'w')
			{
				WHITE_TOGGLE;
			}
			else if (cmd == 'o')
			{
				ORANGE_TOGGLE;
			}
			else if (cmd == 'b')
			{
				BLUE_TOGGLE;
			}
			else if (cmd == 't')
			{
				//TODO: [ML] Read the temperature
			}
			else if (cmd == 's' && idx > 2)
			{
				/**********************************
				s -	Set channel immediate
				input:  s{byte channel}{byte value}
				output: None
				***********************************/
				
				char channel = commandBuffer[1];
				char val = commandBuffer[2];
				set_channel(channel, val);
			}
			else if (cmd == 'r' && idx == 4)
			{
				/********************************************************************************
				r - Read channel value. If channel is not specified, then all values are returned
				input:  r[{channel}]
				output: c{channel}v{value} or v{values}
				*********************************************************************************/
				
				uint8_t channel = commandBuffer[1];
				uint8_t val = read_channel(channel);
				write_char('c');
				write_char(channel);
				write_char('v');
				write_char(val);
				write_line("");				
			}
			else if (cmd == 'r' && idx == 3)
			{
				/********************************************************************************
				r - Read channel value. If channel is not specified, then all values are returned
				input:  r
				output: v{values}
				*********************************************************************************/
				
				uint8_t vals[6];
				read_all_channels(vals);
				
				write_char('v');
				for(uint8_t i = 0; i < 6; i++)
				{
					write_char(vals[i]);
				}
				write_line("");				
			}
			else if (cmd == 'i' && idx > 2)
			{
				for(uint8_t i = 1; i< idx-2; i++)
				{
					set_channel(i-1, commandBuffer[i]);	
				}
			}
			else if (cmd == 'a')
			{
				/****************************************
				a - Set all channels to specified value
				input:	a{value}
				output: None
				****************************************/
					
				uint8_t val = commandBuffer[1];
				set_all_channels(val);
			}
			else if (cmd == 'f')
			{
				for(uint8_t i=1; i<=6; i++)
				{
					newSettings[i-1] = commandBuffer[i];
				}
	
				read_all_channels(currentSettings);
				
				ENABLE_TIMER;
			}
			else
			{
				write_string("Unknown Command: ");
				for(uint8_t i = 0; i < idx; i++)
				{
					write_char(commandBuffer[i]);
				}
				write_line("");
			}
			
			idx = 0;			
		}
		
		if (timer_flag == 1)
		{
			uint8_t done = 1;
			for(int i = 0; i < 6; i++)
			{
				if (currentSettings[i] < newSettings[i])
				{
					currentSettings[i]++;
					done = 0;
				}
				else if (currentSettings[i] > newSettings[i])
				{
					currentSettings[i]--;
					done = 0;
				}
			}
			
			for(uint8_t i = 0; i< 6; i++)
			{
				set_channel(i, currentSettings[i]);
			}
			
			timer_flag = 0;
			
			if (done == 1)
			{
				DISABLE_TIMER;
				BLUE_OFF;
			}
			
		}
		
    }
}

void init()
{	
	init_leds();
	startup_animation();
		
	serial_init();
	
	pwm_init();
	cnt = 0;
	timer_flag = 0;
	TCCR3B = _BV(CS31);
	
	sei();
}

ISR(TIMER3_OVF_vect)
{
	cnt++;
	if (cnt >= 8)
	{
		timer_flag = 1;	
		cnt = 0;
	}
	if (cnt & 0x01)
	{
		BLUE_TOGGLE;	
	}	
}
