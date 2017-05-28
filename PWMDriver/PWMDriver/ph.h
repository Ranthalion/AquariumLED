/*
 * ph.h
 *
 * Created: 3/3/2017 9:17:22 PM
 *  Author: Michael
 */ 


#ifndef PH_H_
#define PH_H_

#define PH_ADDRESS 0xCA

#define PH_INTERRUPT_CONTROL 0x04
#define PH_LED_CONTROL 0x05
#define PH_SLEEP_CONTROL 0x06
#define PH_CALIBRATION_ADDR 0x08
#define PH_CALIBRATION_REQUEST_ADDR 0x0C
#define PH_TEMPERATURE_ADDR 0x0E
#define PH_READING_ADDR 0x16

#define PH_INT_HIGH 0x02
#define PH_INT_LOW 0x04
#define PH_INT_INVERT 0x08

#define PH_CALIBRATION_CLEAR 0x01
#define PH_CALIBRATION_LOW 0x02
#define PH_CALIBRATION_MID 0x03
#define PH_CALIBRATION_HIGH 0x04

void ph_init();
void ph_request_reading();
uint32_t ph_read_ph();
void ph_sleep();
void ph_clear_calibration();
void ph_set_calibration(uint32_t calibration_ph, uint8_t calibration_type);
void ph_set_temparature(uint32_t temperature);
uint8_t ph_read_address(uint8_t address);

#endif /* PH_H_ */