"use strict";

var Cylon = require("cylon");

Cylon.robot({

	connections: {
    	leapmotion: { adaptor: "leapmotion" },
    	arduino: { adaptor: "firmata", port: "/dev/cu.usbmodem1411" } // /dev/cu.usbmodem1411 /dev/cu.usbmodem1451 
 	},

  	devices: {
    	led: { driver: "led", pin: 13, connection: "arduino" },
      led9: { driver: "led", pin: 9, connection: "arduino" },
      leapmotion: { driver: 'leapmotion' }
  	},

	work: function(my) {
    	my.leapmotion.on('frame', function(frame) {
	      	if (frame.hands.length > 0) {
	        	console.log("LED ON")
            my.led.turnOn();
            my.led9.turnOn();
	      	} else {
            console.log("LED OFF");
	      	  my.led.turnOff();
            my.led9.turnOff();
          }
    	});
  	}
  	
}).start();