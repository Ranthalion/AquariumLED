/*
 * serial.h
 *
 * Created: 10/2/2016 4:58:08 PM
 *  Author: Michael
 */ 


#ifndef SERIAL_H_
#define SERIAL_H_


#define USART_BAUDRATE 9600
#define BAUD_PRESCALE (((F_CPU / (USART_BAUDRATE * 16UL))) - 1)

#define RING_MASK 31
volatile uint8_t txHead;
volatile uint8_t txTail;
volatile unsigned char txBuffer[32];

volatile unsigned char commandBuffer[32];
volatile uint8_t idx;

void serial_init();
void write_char(char data);
void write_string(const char *data);
void write_line(const char *data);




#endif /* SERIAL_H_ */