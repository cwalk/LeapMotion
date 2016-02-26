// To run:
// $ node leapCircle.js

var frameCount = 0;

"use strict";

var HOSTNAME = "192.168.0.101";
var USERNAME = "82bf6d045f12856fa06cb642cbff0e";

var rotationRGB = [[255,0,191], [255,0,0], [255,128,0], [255,255,0], [0,255,0], [0,0,255], [191,0,255]];
var rotIndex = 0;
var rotation = 0;

var Cylon = require("cylon");

Cylon.robot({

  name: "leapbot",

  connections: {
    leapmotion: { adaptor: "leapmotion" }
  },

  devices: {
    leapmotion: { driver: "leapmotion" }
  },

  work: function(my) {

  }
}).start();

Cylon.robot({
  
  name: "huebot",

  connections: {
    hue: { adaptor: 'hue', host: HOSTNAME, username: USERNAME }
  },

  devices: {
    bulb1: { driver: "hue-light", lightId: 1 },
    bulb2: { driver: "hue-light", lightId: 2 },
    bulb3: { driver: "hue-light", lightId: 3 },
    bulb4: { driver: "hue-light", lightId: 4 },
    bulb5: { driver: "hue-light", lightId: 5 },
    bulb6: { driver: "hue-light", lightId: 6 },
    bulb7: { driver: "hue-light", lightId: 7 }
  },

  randomNumber: function() {
    return Math.floor(Math.random() * 255);
  },

  changeColor: function(bulb, rotation){
    switch (rotation){
      case 0:
          console.log("Turning bulb pink");
          bulb.rgb(255,0,191);
          break;
      case 1:
          console.log("Turning bulb red");
          bulb.rgb(255,0,0);
          break;
      case 2:
          console.log("Turning bulb orange");
          bulb.rgb(255,128,0); 
          break;
      case 3:
          console.log("Turning bulb yellow");
          bulb.rgb(255,255,0);
          break;
      case 4:
          console.log("Turning bulb green");
          bulb.rgb(0,255,0);
          break;
      case 5:
          console.log("Turning bulb blue");
          bulb.rgb(0,0,255);
          break;
      case 6:
          console.log("Turning bulb purple");
          bulb.rgb(255,0,191);
          break;
    }
  },

  work: function(my) {
    
    Cylon.MCP.robots.leapbot.devices.leapmotion.on('frame', function(frame) {

      frameCount++;
      if(frameCount % 40 != 0) {return;}

      if(frame.hands.length > 0) {
        console.log("Turning all Lights ON because no frame data");
          for (var d in Cylon.bulbs) {
              Cylon.bulbs[d].turnOn();
          }
          console.log("Setting colors");
          Cylon.bulbs.bulb1.rgb(255,0,0); //red
          Cylon.bulbs.bulb2.rgb(255,128,0); //orange
          Cylon.bulbs.bulb3.rgb(255,255,0); //yellow
          Cylon.bulbs.bulb4.rgb(0,255,0); //green
          Cylon.bulbs.bulb5.rgb(0,0,255); //blue
          Cylon.bulbs.bulb6.rgb(191,0,255); //purple
          Cylon.bulbs.bulb7.rgb(255,0,191); //pink

          if(frame.data.gestures.length > 0) {
              //rotIndex = (rotIndex + 1) % rotationRGB.length;
              //Cylon.bulb1.rgb(rotationRGB[rotIndex][0], rotationRGB[rotIndex][1], rotationRGB[rotIndex][2]);
              if(rotation > 6) {rotation = 0;}
              for (var d in Cylon.bulbs) {
                changeColor(Cylon.bulbs[d], rotation);
              }
              rotation++;
          }
          else {
            console.log("Resetting colors");
            Cylon.bulbs.bulb1.rgb(255,0,0); //red
            Cylon.bulbs.bulb2.rgb(255,128,0); //orange
            Cylon.bulbs.bulb3.rgb(255,255,0); //yellow
            Cylon.bulbs.bulb4.rgb(0,255,0); //green
            Cylon.bulbs.bulb5.rgb(0,0,255); //blue
            Cylon.bulbs.bulb6.rgb(191,0,255); //purple
            Cylon.bulbs.bulb7.rgb(255,0,191); //pink
          }  
      }
      else { //frame.hands.length = 0
          console.log("Turning all Lights OFF because no frame data");
          for (var d in Cylon.bulbs) {
              Cylon.bulbs[d].turnOff();
          }
      }
    });

  }
}).start();

Cylon.bulbs = Cylon.MCP.robots.huebot.devices;
Cylon.leap = Cylon.MCP.robots.leapbot.devices.leapmotion;