/*
 * PWMDriver.c
 *
 * Created: 9/26/2016 9:30:17 PM
 * Author : Michael
 */ 

#include <avr/io.h>
#include <avr/interrupt.h>
#include <util/delay.h>

#define USART_BAUDRATE 9600
#define BAUD_PRESCALE (((F_CPU / (USART_BAUDRATE * 16UL))) - 1)

//PD4 - Orange
#define ORANGE_ON (PORTD |= 1 << PORTD4)
#define ORANGE_OFF (PORTD &= ~(1 << PORTD4))
#define ORANGE_TOGGLE (PORTD ^= 1 << PORTD4)

//PD2 - White
#define WHITE_ON (PORTD |= 1 << PORTD2)
#define WHITE_OFF (PORTD &= ~(1 << PORTD2))
#define WHITE_TOGGLE (PORTD ^= 1 << PORTD2)

//PE0 - Blue
#define BLUE_ON (PORTE |= 1 << PORTE0)
#define BLUE_OFF (PORTE &= ~(1 << PORTE0))
#define BLUE_TOGGLE (PORTE ^= 1 << PORTE0)

void init();
void startup_animation();

int main(void)
{
	init();
	
    while (1) 
    {
		
		
    }
}

void init()
{	
	UCSR0B = (1 << RXEN0) | (1 << TXEN0);   // Turn on the transmission and reception circuitry
	UCSR0C = (1 << UCSZ00) | (1 << UCSZ10); // Use 8-bit character sizes

	
	UBRR0H = (BAUD_PRESCALE >> 8); // Load upper 8-bits of the baud rate value into the high byte of the UBRR register
	UBRR0L = BAUD_PRESCALE; // Load lower 8-bits of the baud rate value into the low byte of the UBRR register
	
	DDRD |= 1 << DDRD4;		//Enable output for orange LED
	DDRD |= 1 << DDRD2;		//Enable output for white LED
	DDRE |= 1 << DDRE0;		//Enable output for blue LED
	
	startup_animation();
	
	UCSR0B |= (1 << RXCIE0); // Enable the USART Receive Complete interrupt (USART_RXC)
	sei();
}

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
ISR(USART0_RX_vect)
{
	char ReceivedByte;
	ReceivedByte = UDR0; // Fetch the received byte value into the variable "ByteReceived"
	UDR0 = ReceivedByte; // Echo back the received byte back to the computer
}