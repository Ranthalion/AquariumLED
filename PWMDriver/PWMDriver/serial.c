#include <avr/io.h>
#include <avr/interrupt.h>
#include "serial.h"
#include "leds.h"

void serial_init()
{
	//init UART
	UBRR0 = BAUD_PRESCALE;
	UCSR0C = _BV(UCSZ00) | _BV(UCSZ01); // Use 8-bit character sizes
	UCSR0B = _BV(RXEN0) | _BV(TXEN0);   // Turn on the transmission and reception circuitry
	UCSR0B |= _BV(RXCIE0); // Enable the USART Receive Complete interrupt (USART_RXC)

	txHead = 0;
	txTail = 0;
	idx = 0;	
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

void write_line(const char *data)
{
	write_string(data);
	write_string("\r\n");
	
}

ISR(USART0_RX_vect)
{
	if (idx >= 32)
	{
		ORANGE_TOGGLE;
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