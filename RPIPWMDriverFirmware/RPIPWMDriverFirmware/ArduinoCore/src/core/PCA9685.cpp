/*
 * PCA9685.cpp
 *
 * Created: 3/27/2016 3:55:44 PM
 *  Author: Michael
 */ 


#include <PCA9685.h>
#include <Wire.h>

PCA9685::PCA9685(uint8_t address) {
  _address = address;
}

void PCA9685::begin(void) {
 Wire.begin();
 delay(10);
 setAll(0);
 reset();
}


void PCA9685::reset(void) {
 write8(PCA9685_MODE1, 0x20);
   Wire.beginTransmission(_address);
   Wire.write(PCA9685_MODE1);
   Wire.write(0x20);				//Auto Increment
   Wire.endTransmission();
}

void PCA9685::setFrequency(float frequency) {
  frequency *= 0.9;  // Correct for overshoot in the frequency setting (see issue #11).
  float prescaleval = 25000000;
  prescaleval /= 4096;
  prescaleval /= frequency;
  prescaleval -= 1;
  uint8_t prescale = floor(prescaleval + 0.5);
  
  uint8_t oldmode = read8(PCA9685_MODE1);
  uint8_t newmode = (oldmode&0x7F) | 0x10; // sleep
  write8(PCA9685_MODE1, newmode); // go to sleep
  write8(PCA9685_PRESCALE, prescale); // set the prescaler
  write8(PCA9685_MODE1, oldmode);
  delay(5);
  write8(PCA9685_MODE1, oldmode | 0xa1);  //  This sets the MODE1 register to turn on auto increment.
                                          // This is why the beginTransmission below was not working.
}

void PCA9685::allOn()
{
	setAll(4095);	
}

void PCA9685::allOff()
{
	setAll(0);
}

void PCA9685::on(uint8_t channel)
{
	setPin(channel, 4095);
}

void PCA9685::off(uint8_t channel)
{
	setPin(channel, 0);
}

void PCA9685::setAll(long value)
{
		value = min(value, 4095);
		setPin(61, value);
}

void PCA9685::setChannel(uint8_t channel, long value)
{
	setPin(channel, value);
}

void PCA9685::setChannels(long* values)
{
	uint8_t buff[16*4];
	uint16_t val;
	
	for(uint8_t i = 0; i < NUM_CHANNELS; i++)
	{
		values[i] = min(values[i], 4095);
		
		if (values[i] == 4095) {
			// Special value for signal fully on.
			buff[(i*4)] = 4096;
			buff[(i*4)+1] = 4096>>8;
			buff[(i*4)+2] = 0; 
			buff[(i*4)+3] = 0;
		}
		else if (values[i] == 0) {
			// Special value for signal fully off.
			buff[(i*4)] = 0;
			buff[(i*4)+1] = 0;
			buff[(i*4)+2] = 4096; 
			buff[(i*4)+3] = 4096>>8;
		}
		else{
			buff[(i*4)] = 0;
			buff[(i*4)+1] = 0;
			buff[(i*4)+2] = values[i]; //Will this be a bug?
			buff[(i*4)+3] = values[i]>>8;
		}
	}
	
	Wire.beginTransmission(_address);
	Wire.write(LED0_ON_L);
	for(uint8_t i = 0; i < NUM_CHANNELS*4; i++)
	{
		Wire.write(buff[i]);
	}
	Wire.endTransmission();
	
}

long PCA9685::readChannel(uint8_t pin)
{
	if (pin >= NUM_CHANNELS)
		return 0;
		
	uint8_t startAddr = (pin*4) + BASE_LED_ADDR;
	
	long on;
	long off;
	byte val[4];
	uint8_t i = 0;
	
	Wire.beginTransmission(_address);
	Wire.write(startAddr);
	Wire.endTransmission();

	Wire.requestFrom(_address, 4);
	while (Wire.available())
	{
		val[i++] = Wire.read();
	}
	on = (val[1] << 8) + val[0];
	off = (val[3] << 8) + val[2];
	if (off == 4096)
		return 0;
	if (on == 4096)
		return 4095;
	
	return off;
	
}

byte PCA9685::readRegister(uint8_t location)
{
	byte val;
	Wire.beginTransmission(_address);
	Wire.write(location);
	Wire.endTransmission();

	Wire.requestFrom(_address, 1);
	while (Wire.available())
	{
		val = Wire.read();
	}
	return val;
}

void PCA9685::setPWM(uint8_t num, uint16_t on, uint16_t off) {
	
	Wire.beginTransmission(_address);
	Wire.write(LED0_ON_L+4*num);
	Wire.write(on);
	Wire.write(on>>8);
	Wire.write(off);
	Wire.write(off>>8);
	Wire.endTransmission();
}

// Sets pin without having to deal with on/off tick placement and properly handles
// a zero value as completely off.  Optional invert parameter supports inverting
// the pulse for sinking to ground.  Val should be a value from 0 to 4095 inclusive.
void PCA9685::setPin(uint8_t num, uint16_t val)
{
	// Clamp value between 0 and 4095 inclusive.
	val = min(val, 4095);
	
	if (val == 4095) {
		// Special value for signal fully on.
		setPWM(num, 4096, 0);
	}
	else if (val == 0) {
		// Special value for signal fully off.
		setPWM(num, 0, 4096);
	}
	else {
		setPWM(num, 0, val);
	}
	
}

uint8_t PCA9685::read8(uint8_t addr) {
  Wire.beginTransmission(_address);
  Wire.write(addr);
  Wire.endTransmission();

  Wire.requestFrom((uint8_t)_address, (uint8_t)1);
  return Wire.read();
}

void PCA9685::write8(uint8_t addr, uint8_t d) {
  Wire.beginTransmission(_address);
  Wire.write(addr);
  Wire.write(d);
  Wire.endTransmission();
}
