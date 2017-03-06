#include <avr/io.h>

#ifndef LEDS_H_
#define LEDS_H_


//PD4 - Purple (LED1)
#define PURPLE_ON (PORTD |= 1 << PORTD4)
#define PURPLE_OFF (PORTD &= ~(1 << PORTD4))
#define PURPLE_TOGGLE (PORTD ^= 1 << PORTD4)

#define LED1_ON (PORTD |= 1 << PORTD4)
#define LED1_OFF (PORTD &= ~(1 << PORTD4))
#define LED1_TOGGLE (PORTD ^= 1 << PORTD4)


//PE0 - Orange (LED2)
#define ORANGE_ON (PORTE |= 1 << PORTE0)
#define ORANGE_OFF (PORTE &= ~(1 << PORTE0))
#define ORANGE_TOGGLE (PORTE ^= 1 << PORTE0)

#define LED2_ON (PORTE |= 1 << PORTE0)
#define LED2_OFF (PORTE &= ~(1 << PORTE0))
#define LED2_TOGGLE (PORTE ^= 1 << PORTE0)


//PE1 - Blue (LED3)
#define BLUE_ON (PORTE |= 1 << PORTE1)
#define BLUE_OFF (PORTE &= ~(1 << PORTE1))
#define BLUE_TOGGLE (PORTE ^= 1 << PORTE1)

#define LED3_ON (PORTE |= 1 << PORTE1)
#define LED3_OFF (PORTE &= ~(1 << PORTE1))
#define LED3_TOGGLE (PORTE ^= 1 << PORTE1)

void startup_animation();
void init_leds();



#endif /* LEDS_H_ */