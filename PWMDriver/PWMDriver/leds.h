#include <avr/io.h>

#ifndef LEDS_H_
#define LEDS_H_


//PD4 - Orange
#define ORANGE_ON (PORTD |= 1 << PORTD4)
#define ORANGE_OFF (PORTD &= ~(1 << PORTD4))
#define ORANGE_TOGGLE (PORTD ^= 1 << PORTD4)

//PE1 - White
#define WHITE_ON (PORTE |= 1 << PORTE1)
#define WHITE_OFF (PORTE &= ~(1 << PORTE1))
#define WHITE_TOGGLE (PORTE ^= 1 << PORTE1)

//PE0 - Blue
#define BLUE_ON (PORTE |= 1 << PORTE0)
#define BLUE_OFF (PORTE &= ~(1 << PORTE0))
#define BLUE_TOGGLE (PORTE ^= 1 << PORTE0)

void startup_animation();
void init_leds();



#endif /* LEDS_H_ */