/*
 * pca9685.h
 *
 * Created: 3/27/2016 3:49:07 PM
 *  Author: Michael
 */ 


#ifndef PCA9685_H_
#define PCA9685_H_


#if ARDUINO >= 100
 #include "Arduino.h"
#else
 #include "WProgram.h"
#endif

#define NUM_CHANNELS 6
#define PCA9685_SUBADR1 0x2
#define PCA9685_SUBADR2 0x3
#define PCA9685_SUBADR3 0x4

#define PCA9685_MODE1 0x0
#define PCA9685_PRESCALE 0xFE

#define LED0_ON_L 0x6
#define LED0_ON_H 0x7
#define LED0_OFF_L 0x8
#define LED0_OFF_H 0x9

#define ALLLED_ON_L 0xFA
#define ALLLED_ON_H 0xFB
#define ALLLED_OFF_L 0xFC
#define ALLLED_OFF_H 0xFD

#define BASE_LED_ADDR 0x06
#define ALL_LED_ADDR 0xFA


class PCA9685 {
 public:
  PCA9685(uint8_t addr = 0x60);
  void begin(void);
  void reset(void);
  void setFrequency(float frequency);
  
  void allOn();
  void allOff();
  void on(uint8_t channel);
  void off(uint8_t channel);
  
  void setAll(long value);
  void setChannel(uint8_t channel, long value);
  void setChannels(long* values);
  long readChannel(uint8_t channel);
  

 private:
  uint8_t _address;

  uint8_t read8(uint8_t addr);
  void write8(uint8_t addr, uint8_t d);
  void setPWM(uint8_t pin, uint16_t on, uint16_t off);
  void setPin(uint8_t pin, uint16_t val);
};


#endif /* PCA9685_H_ */