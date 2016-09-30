/*
 * leds.h
 *
 * Created: 9/28/2016 9:50:20 PM
 *  Author: Michael
 */ 


#ifndef LEDS_H_
#define LEDS_H_


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

void startup_animation();
void init_leds();



#endif /* LEDS_H_ */