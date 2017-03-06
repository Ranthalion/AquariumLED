#include <avr/interrupt.h>
#include <util/delay.h>
#include <stdio.h>
#include "leds.h"
#include "pwm.h"
#include "serial.h"
#include "onewire.h"
#include "ds18x20.h"
#include "i2c.h"
#include "ph.h"

#define MAXSENSORS 5
#define MOISTURE_THRESHOLD 64
//Timer 3
#define ENABLE_TIMER TIMSK3 |= _BV(TOIE3)
#define DISABLE_TIMER TIMSK3 &= ~_BV(TOIE3)

//Moisture Sensor
#define MOISTURE_SENSOR_ON PORTC |= 1 << PORTC2			//Set the output high
#define MOISTURE_SENSOR_OFF PORTC &= ~(1 << PORTC2)		//Set the output low

#define OFF 0
#define ORANGE_BLINK 1
#define PURPLE_BLINK 2
#define BLUE_BLINK 3
#define TEMP_SEARCH 4

char led_mode;
volatile uint8_t timer_flag;
volatile uint8_t cnt;
volatile uint8_t read_temp;
volatile uint8_t adc_counter;
volatile uint8_t adc_ready;
volatile uint8_t ph_counter;
volatile uint8_t ph_ready;

uint8_t currentSettings[6];
uint8_t newSettings[6];
uint8_t delta[6];
uint8_t gSensorIDs[MAXSENSORS][OW_ROMCODE_SIZE];
char strBuffer[10];
uint8_t moisture_reading;
uint8_t buff[10];

void init();


static uint8_t search_sensors(void)
{
	uint8_t i;
	uint8_t id[OW_ROMCODE_SIZE];
	uint8_t diff, nSensors;
	
	ow_reset();

	nSensors = 0;
	
	diff = OW_SEARCH_FIRST;
	while ( diff != OW_LAST_DEVICE && nSensors < MAXSENSORS ) {
		DS18X20_find_sensor( &diff, &id[0] );
		
		if( diff == OW_PRESENCE_ERR ) {
			break;
		}
		
		if( diff == OW_DATA_ERR ) {
			break;
		}
		
		for ( i=0; i < OW_ROMCODE_SIZE; i++ )
		gSensorIDs[nSensors][i] = id[i];
		
		nSensors++;
	}
	
	return nSensors;
}

/* 

	Commands
	w - Toggle the purple LED
		input:  None
		output: None
	o - Toggle the orange LED
		input:  None
		output: None
	b - Toggle the blue LED
		input:  None
		output: None
	s -	Set channel immediate 
		input:  s{byte channel}{byte value}
		output: None		
	r - Read channel value. If channel is not specified, then all values are returned
		input:  r{channel} or r
		output: c{channel}v{value} or v{values}
	a - Set all channels to specified value
		input:	a{value}
		output: None
	i - Set all channels immediately
		input:  i{[comma separated values]}
		output: None
	f - Fade channels to specified values
		input:	f{[comma separated values]}
		output: None
	t - Read current temperature
		input: None
		output: current temperature in degrees celcius
	p - Read ph
		input: None
		output PH reading value multiplied by 1000 ph{xxxx}
	c - Clear ph calibration
	m - Calibrate PH mid point
	l - Calibrate PH low point
	h - Calibrate PH high point
	
*/

int main(void)
{
	uint8_t nSensors;
	uint8_t i;
	int16_t decicelsius;
	uint8_t error;
		
	init();
	//init one wire bus
	led_mode = TEMP_SEARCH;
	ENABLE_TIMER;
	nSensors = search_sensors();
	led_mode = OFF;
	
    while (1) 
    {
		
		if (idx > 2 && (commandBuffer[idx - 2] == 13 || commandBuffer[idx-1] == 10))
		{
			char cmd = commandBuffer[0];
			
			if (cmd == 'w')
			{
				BLUE_TOGGLE;
			}
			else if (cmd == 'p')
			{
				PURPLE_TOGGLE;
			}
			else if (cmd == 'o')
			{
				ORANGE_TOGGLE;
			}
			else if (cmd == 't')
			{
				read_temp = 0;
			}
			else if (cmd == 's' && idx > 2)
			{
				/**********************************
				s -	Set channel immediate
				input:  s{byte channel}{byte value}
				output: None
				***********************************/
				
				char channel = commandBuffer[1];
				char val = commandBuffer[2];
				set_channel(channel, val);
			}
			else if (cmd == 'r' && idx == 4)
			{
				/********************************************************************************
				r - Read channel value. If channel is not specified, then all values are returned
				input:  r[{channel}]
				output: c{channel}v{value} or v{values}
				*********************************************************************************/
				
				uint8_t channel = commandBuffer[1];
				uint8_t val = read_channel(channel);
				write_char('c');
				write_char(channel);
				write_char('v');
				write_char(val);
				write_line("");				
			}
			else if (cmd == 'r' && idx == 3)
			{
				/********************************************************************************
				r - Read channel value. If channel is not specified, then all values are returned
				input:  r
				output: v{values}
				*********************************************************************************/
				
				uint8_t vals[6];
				read_all_channels(vals);
				
				write_char('v');
				for(uint8_t i = 0; i < 6; i++)
				{
					write_char(vals[i]);
				}
				write_line("");				
			}
			else if (cmd == 'i' && idx > 2)
			{
				for(uint8_t i = 1; i< idx-2; i++)
				{
					set_channel(i-1, commandBuffer[i]);	
				}
			}
			else if (cmd == 'a')
			{
				/****************************************
				a - Set all channels to specified value
				input:	a{value}
				output: None
				****************************************/
					
				uint8_t val = commandBuffer[1];
				set_all_channels(val);
			}
			else if (cmd == 'f')
			{
				for(uint8_t i=1; i<=6; i++)
				{
					newSettings[i-1] = commandBuffer[i];
				}
	
				read_all_channels(currentSettings);
				timer_flag = 1;
				led_mode = ORANGE_BLINK;				
			}
			else if (cmd == 'p')
			{
				ph_counter = 0;
			}
			else if (cmd == 'c')
			{
				ph_clear_calibration();
			}
			else if (cmd == 'm')
			{
				uint32_t ph = 7000;
				ph_set_calibration(ph, PH_CALIBRATION_MID);
			}
			else if (cmd == 'l')
			{
				uint32_t ph = 4000;
				ph_set_calibration(ph, PH_CALIBRATION_LOW);
			}
			else if (cmd == 'h')
			{
				uint32_t ph = 10000;
				ph_set_calibration(ph, PH_CALIBRATION_HIGH);
			}
			else
			{
				write_string("Unknown Command: ");
				for(uint8_t i = 0; i < idx; i++)
				{
					write_char(commandBuffer[i]);
				}
				write_line("");
			}
			
			idx = 0;			
		}
		
		if (ph_counter == 0)
		{
			ph_request_reading();
			ph_counter = 120;
		}
		
		if(ph_ready == 1)
		{
			ph_sleep();
			uint32_t ph = ph_read_ph();
			write_string("PH ");
			snprintf(strBuffer, sizeof strBuffer, "%lu", ph);
			write_string(strBuffer);
			write_line("");
			
			ph_ready = 0;
		}
		
		if (adc_counter == 0)
		{
			MOISTURE_SENSOR_ON;
			//Initiate adc reading
			//adc_counter = 26;
			
			// Enable ADC, start conversion, and enable interrupt
			ADCSRA |= ((1 << ADEN) | (1 << ADSC) | (1 << ADIE));
		}
		
		if (adc_ready == 1)
		{
			MOISTURE_SENSOR_OFF;
			adc_ready = 0;
			
			moisture_reading = ADCH;
			ADCSRA &= ~(1 << ADEN);
			
			adc_counter = 2;
			if (moisture_reading > MOISTURE_THRESHOLD)
			{
				//TODO: [ML] Send notification to the rpi	
				write_line("LEAK DETECTED");
			}
		}
		
		if(read_temp == 0)
		{
			read_temp = 120;
			
			uint8_t read_result = DS18X20_start_meas( DS18X20_POWER_EXTERN, NULL );
			
			if ( read_result == DS18X20_OK) {
				_delay_ms( DS18B20_TCONV_12BIT );
				for ( i = 0; i < nSensors; i++ ) {
					write_string( "T" );
					write_char( (int)i + 1 );
					write_string(" ");
					
					read_result = DS18X20_read_decicelsius( &gSensorIDs[i][0], &decicelsius );
					if ( read_result == DS18X20_OK ) {
						DS18X20_format_from_decicelsius(decicelsius, strBuffer, 9);
						write_string(strBuffer);
					}
					else {
						write_line( "CRC Error (lost connection?)" );
						error++;
					}
					write_line("");
				}
			}
			else {
				write_line( "Start meas. failed (short circuit?)" );
				error++;
			}
		}
		
		if (timer_flag == 1)
		{
			uint8_t done = 1;
			for(int i = 0; i < 6; i++)
			{
				if (currentSettings[i] < newSettings[i])
				{
					currentSettings[i]++;
					done = 0;
				}
				else if (currentSettings[i] > newSettings[i])
				{
					currentSettings[i]--;
					done = 0;
				}
			}
			
			for(uint8_t i = 0; i< 6; i++)
			{
				set_channel(i, currentSettings[i]);
			}
			
			timer_flag = 0;
			
			if (done == 1)
			{
				DISABLE_TIMER;
				ORANGE_OFF;
			}
			
		}
		
    }
}

void init()
{	
	init_leds();
	startup_animation();
		
	serial_init();
	
	pwm_init();
	cnt = 0;
	timer_flag = 0;
	read_temp = 100;
	ph_counter = 50;
	TCCR3B = _BV(CS31);
	
	//Set PC2 as output and set to 1
	DDRC |= 1 << DDRC2;		//Enable output for PC2
	PORTC |= 1 << PORTC2;	//Set the output high
	
	//Set PC3 as analog input
	ADMUX = (1 << ADLAR) | (3); //Left align ADC reading and connect ADC3 to mux
	
	// divide ADC clock by 64
	ADCSRA = (1 << ADPS2) | (1 << ADPS1);

	
	//Configure interrupt on pin change (pin 32 PD2)
	EICRA = 0x01;	//Any logical change on INT0 generates an interrupt request
	EIMSK = 0x01;	//External Interrupt Request 0 Enable
	EIFR = 0x00;
	
	ph_ready = 0;
	
	i2c_init();
	ph_init();
	adc_ready = 0;
	
	sei();	
}


ISR(TIMER3_OVF_vect)
{	
	cnt++;
	if (cnt == 50){
		read_temp--;
	}
	
	if (cnt == 140)
	{
		adc_counter--;
	}
	
	if (cnt == 240)
	{
		ph_counter--;
	}
	
	if (led_mode == ORANGE_BLINK){
		if (cnt & 0x01)
			ORANGE_TOGGLE;	
	}else if(led_mode == BLUE_BLINK){
		if (cnt & 0x01)
			BLUE_TOGGLE;
	}else if(led_mode == PURPLE_BLINK){
		if (cnt & 0x01)
			PURPLE_TOGGLE;
	}else if(led_mode == TEMP_SEARCH){
		if (cnt & 0x110)
			BLUE_TOGGLE;
	}		
}

ISR(ADC_vect)
{
	adc_ready = 1;
}

ISR(INT0_vect)
{
	ph_ready = 1;
}