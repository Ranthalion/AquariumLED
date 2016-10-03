/*
 * pwm.h
 *
 * Created: 10/2/2016 4:34:37 PM
 *  Author: Michael
 */ 


#ifndef PWM_H_
#define PWM_H_

void pwm_init();
void set_channel(uint8_t channel, uint8_t val);
void set_all_channels(uint8_t val);
uint8_t read_channel(uint8_t channel);
void read_all_channels(uint8_t *vals);

#endif /* PWM_H_ */