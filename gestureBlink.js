"use strict";

var Cylon = require("cylon");

Cylon.robot({

  connections: {
      leapmotion: { adaptor: "leapmotion" },
      arduino: { adaptor: "firmata", port: "/dev/cu.usbmodem1411" } ///dev/cu.usbmodem1451
  },

    devices: {
      led13: { driver: "led", pin: 13, connection: "arduino" },
      leapmotion: { driver: 'leapmotion' },
      led9: { driver: "led", pin: 9, connection: "arduino" },
      leapmotion: { driver: 'leapmotion' }
    },

  work: function(my) {
    my.leapmotion.on('frame', function(frame) {
      // if (frame.hands.length > 0) {
      var gest = frame.data.gestures;
      gest.forEach(function (obj) {
        if(obj.type == 'swipe' && obj.state == 'start') {
          console.log('Toggling led13 for Swipe Gesture');
          my.led13.toggle();
        }
        if(obj.type == 'keyTap') {
          console.log('Toggling led9 for keyTap Gesture');
          my.led9.toggle();
        }
      });
    });
  }
    
}).start();

//console.log(Cylon);