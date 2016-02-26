import RPi.GPIO as GPIO
import os
import time

inPin = 12
GPIO.setmode(GPIO.BOARD)
GPIO.setup(inPin, GPIO.IN)

num_changed = 0;
light_on = False;
while True:
    button_pressed = not GPIO.input(inPin)
    if button_pressed and light_on:
	light_on = False
        print "Not Pressed"
	os.system('node turnAllOff.js')
	
    elif button_pressed:
	num_changed += 1
	light_on = True
        print "Pressed ", num_changed
	os.system('node turnAllOn.js')

GPIO.cleanup()
