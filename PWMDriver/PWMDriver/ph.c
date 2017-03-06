#include <avr/io.h>
#include <avr/interrupt.h>
#include "i2c.h"
#include "ph.h"

void ph_init()
{
	//Turn off LED
	uint8_t off = 0x00;
	i2c_writeReg(PH_ADDRESS, PH_LED_CONTROL, &off, 1);
	
	//Set interrupt control register to 
	uint8_t invert = PH_INT_INVERT;
	i2c_writeReg(PH_ADDRESS, PH_INTERRUPT_CONTROL, &invert, 1);
	
	ph_sleep();
	
}

void ph_request_reading()
{
	//Activate PH reading
	uint8_t activate = 0x01;
	i2c_writeReg(PH_ADDRESS, PH_SLEEP_CONTROL, &activate, 1);
	
	//Enable LED
	uint8_t off = 0x01;
	i2c_writeReg(PH_ADDRESS, PH_LED_CONTROL, &off, 1);
	
}

uint32_t ph_read_ph()
{
	uint32_t ph;
	uint8_t phBuff[4];
	i2c_readReg(PH_ADDRESS, PH_READING_ADDR, phBuff, 4);	
	ph = phBuff[3]|(phBuff[2]<<8)|(phBuff[1]<<16)|(phBuff[0]<<24);
	return ph;
}

void ph_sleep()
{
	//Turn off LED
	uint8_t off = 0x00;
	i2c_writeReg(PH_ADDRESS, PH_LED_CONTROL, &off, 1);
	
	//Place ph in sleep mode
	uint8_t sleep = 0x00;
	i2c_writeReg(PH_ADDRESS, PH_SLEEP_CONTROL, &sleep, 1);
}

void ph_clear_calibration()
{
	uint8_t clear = PH_CALIBRATION_CLEAR;
	i2c_writeReg(PH_ADDRESS, PH_CALIBRATION_REQUEST_ADDR, &clear, 4);
}

void ph_set_calibration(uint32_t calibration_ph, uint8_t calibration_type)
{
	i2c_writeReg(PH_ADDRESS, PH_CALIBRATION_ADDR, (uint8_t *)&calibration_ph, 4);
	i2c_writeReg(PH_ADDRESS, PH_CALIBRATION_REQUEST_ADDR, &calibration_type, 1);
}

void ph_set_temparature(uint32_t temperature)
{
	i2c_writeReg(PH_ADDRESS, PH_TEMPERATURE_ADDR, (uint8_t *)&temperature, 4);
}