#include <avr/io.h>
#include <avr/interrupt.h>
#include <util/delay.h>
#include "leds.h"

#define USART_BAUDRATE 9600
#define BAUD_PRESCALE (((F_CPU / (USART_BAUDRATE * 16UL))) - 1)

#define RING_MASK 31
volatile uint8_t txHead = 0;
volatile uint8_t txTail = 0;
volatile unsigned char txBuffer[32];

void init();
void pwm_init();
void write_char(char data);
void write_string(const char *data);

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
		if (idx > 0 && (commandBuffer[idx - 1] == '\n' || commandBuffer[idx-1] == '\r'))
		{
			//Process the command
			if (commandBuffer[0] == 'w')
			{
				write_string("Toggle White\r\n");			
				WHITE_TOGGLE;
			}
			else if (commandBuffer[0] == 'o')
			{
				write_string("Toggle Orange\r\n");
				ORANGE_TOGGLE;
			}
			else if (commandBuffer[0] == 'b')
			{
				write_string("Toggle Blue\r\n");
				BLUE_TOGGLE;
			}
			else
			{
				write_string("Unknown Command: ");
				for(uint8_t i = 0; i < idx; i++)
				{
					write_char(commandBuffer[i]);
				}
				write_string("\r\n");
			}
			
			idx = 0;			
		}
		
    }
}

void init()
{	
	init_leds();
	startup_animation();
		
	UBRR0 = BAUD_PRESCALE;	
	UCSR0C = _BV(UCSZ00) | _BV(UCSZ01); // Use 8-bit character sizes
	UCSR0B = _BV(RXEN0) | _BV(TXEN0);   // Turn on the transmission and reception circuitry	
	UCSR0B |= _BV(RXCIE0); // Enable the USART Receive Complete interrupt (USART_RXC)
	
	pwm_init();
	
	
	sei();
}

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

	
	/* Set the compare value to control duty cycle */
	OCR0A = 120;
	OCR0B = 220;
	
	
	OCR1A = 32;
	OCR1B = 200;
	
	OCR2A = 64;
	OCR2B = 128;
}


void write_char (char data)
{
	uint8_t tmp;

	tmp = (txHead + 1) & RING_MASK;

	while ( tmp == txTail ) {}

	txBuffer[tmp] = data;
	txHead = tmp;
	
	UCSR0B |= _BV(UDRIE0);	// enable UDRE interrupt 
}

void write_string (const char *data)
{
	while (*data) 
	{
		write_char(*data++);
	}
}


ISR(USART0_RX_vect)
{
	if (idx >= 32)
	{
		BLUE_TOGGLE;
		//TODO: [ML] Should this raise some sort of error event?
		idx = 31;
	}
	
	commandBuffer[idx++] = UDR0;
}

ISR(USART0_UDRE_vect)
{
	uint8_t tmp;
	
	if ( txHead != txTail) {
		tmp = (txTail + 1) & RING_MASK;
		txTail = tmp;
		
		UDR0 = txBuffer[tmp];
	} 
	else 
	{
		UCSR0B &= ~_BV(UDRIE0);	//disable UDRE interrupt
	}
}