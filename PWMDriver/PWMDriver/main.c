#include <avr/interrupt.h>
#include "leds.h"
#include "pwm.h"
#include "serial.h"

//Timer 3 for PWM dimming
#define ENABLE_TIMER_1 TIMSK1 |= (1 << OCIE1A)
#define DISABLE_TIMER_1 TIMSK1 &= ~(1 << OCIE1A)

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
			
			if (cmd == 'w')
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
				write_line("Fade received");
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
		
    }
}

void init()
{	
	init_leds();
	startup_animation();
		
	serial_init();
	
	pwm_init();
	
	sei();
}
