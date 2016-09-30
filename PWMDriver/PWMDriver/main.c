
#include <avr/io.h>
#include <avr/interrupt.h>
#include "leds.h"

#define USART_BAUDRATE 9600
#define BAUD_PRESCALE (((F_CPU / (USART_BAUDRATE * 16UL))) - 1)

void init();

volatile unsigned char commandBuffer[32];
volatile uint8_t idx = 0;

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
		
	Pending
	s -	Set channel immediate 
		input:  s{channel}v{value}
		output: None		
	r - Read channel value. If channel is not specified, then all values are returned
		input:  r[{channel}]
		output: c{channel}v{value} or v{values}
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
int main(void)
{
	init();
	
    while (1) 
    {
		if (idx > 0 && (commandBuffer[idx - 1] == 'a' || commandBuffer[idx - 1] == '\n'))
		{
			//Process the command
			if (commandBuffer[0] == 'w')
			{
				
				WHITE_TOGGLE;
			}
			else if (commandBuffer[0] == 'o')
			{
				ORANGE_TOGGLE;
			}
			else if (commandBuffer[0] == 'b')
			{
				BLUE_TOGGLE;
			}
			else
			{
				//Serial write "Command not recognized: <CMD>
			}
			
			idx = 0;
			
		}
		
		
    }
}

void init()
{	
	init_leds();
	startup_animation();
	
	UCSR0B = (1 << RXEN0) | (1 << TXEN0);   // Turn on the transmission and reception circuitry
	UCSR0C = (1 << UCSZ00) | (1 << UCSZ10); // Use 8-bit character sizes
	
	UBRR0H = (BAUD_PRESCALE >> 8); // Load upper 8-bits of the baud rate value into the high byte of the UBRR register
	UBRR0L = BAUD_PRESCALE; // Load lower 8-bits of the baud rate value into the low byte of the UBRR register
	
	UCSR0B |= (1 << RXCIE0); // Enable the USART Receive Complete interrupt (USART_RXC)
	sei();
}


ISR(USART0_RX_vect)
{
	commandBuffer[idx++] = UDR0;
	unsigned char cmd = 'o';
	if (idx == 3)
	{
		ORANGE_TOGGLE;
	}
	
	//This always result in framing error...
	//UDR0 = 0b00110101;
	
	//Echo works
	UDR0 = commandBuffer[idx-1];
	
	if (idx >= 32)
	{
		//TODO: [ML] Should this raise some sort of error event?
		idx = 31;
	}
}