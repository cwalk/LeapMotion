var frameCount = 0;
var speedFlag = process.argv[2]; //1 for speed controlled by hand position, everything else is constant

var Cylon = require('cylon');

Cylon.robot({

  name: 'leapBot',

  connections: {
    leapmotion: { adaptor: 'leapmotion' }
  },

  devices: {
    leapmotion: { driver: 'leapmotion', connection: 'leapmotion' },
  },

  work: function(my) {
  }
}).start();

Cylon.robot({

  name: 'bb8Bot',

  connections: {
    bluetooth: { adaptor: 'central', uuid: '4d131c5eb1d24763ae6253342020d5f4', module: 'cylon-ble'}
  },

  devices: {
    bb8: { driver: 'bb8', module: 'cylon-sphero-ble'}
  },

  work: function(my) {

    leap.on('frame', function(frame) {

      frameCount++;
      if(frameCount % 20 != 0) {return;}

      if(frame.hands.length > 0) {

        if (frame.hands[0].sphereCenter[1] > 300){
          //gesture support
          if(frame.data.gestures.length > 0) {
              if(frame.data.gestures[0].type == "circle"){
                console.log("Disco Party Mode Activated!");
                my.bb8.spin("left", 250);
                my.bb8.randomColor();
              }
          }
          else { //just stop if no gestures and hand is above Y axis too high
            my.bb8.stop();
            my.bb8.color(0xFFFFFF);
          }

        }
        else {//movement if hand is below 300 in Y axis
              //move forward
              if (frame.hands[0].sphereCenter[2] < -50) {
                //move forward right //orange ff8000
                if (frame.hands[0].sphereCenter[0] > 50) {
                  console.log("moving forward right with speed of: 160. Position is: " + Math.abs(frame.hands[0].sphereCenter[0]));
                  my.bb8.color(0xff8000);
                  if(speedFlag != 1) { my.bb8.roll(160, 45); }
                  else { my.bb8.roll(100 + Math.abs(frame.hands[0].sphereCenter[0]), 45); }
                }
                //move forward left //pink ff00bf
                else if (frame.hands[0].sphereCenter[0] < -50) {
                  console.log("moving forward left with speed of: 160. Position is: " + Math.abs(frame.hands[0].sphereCenter[0]));
                  my.bb8.color(0xff00bf);
                  if(speedFlag != 1) { my.bb8.roll(160, 315); }
                  else { my.bb8.roll(100 + Math.abs(frame.hands[0].sphereCenter[0]), 315); }
                }
                //move forward straight //red ff0000
                else {
                  console.log("moving forward straight with speed of: 160. Position is: " + Math.abs(frame.hands[0].sphereCenter[2]));
                  my.bb8.color(0xff0000);
                  if(speedFlag != 1) { my.bb8.roll(160, 0); }
                  else { my.bb8.roll(100 + Math.abs(frame.hands[0].sphereCenter[2]), 0); }
                }
              }
              //move backward
              else if (frame.hands[0].sphereCenter[2] > 50) {
                //move backward right //green 00ff00
                if (frame.hands[0].sphereCenter[0] > 50) {
                  console.log("moving backward right with speed of: 160. Position is: " + Math.abs(frame.hands[0].sphereCenter[0]));
                  my.bb8.color(0x00ff00);
                  if(speedFlag != 1) { my.bb8.roll(160, 135); }
                  else { my.bb8.roll(100 + Math.abs(frame.hands[0].sphereCenter[0]), 135); }
                }
                //move backward left //blue 0000ff
                else if (frame.hands[0].sphereCenter[0] < -50) {
                  console.log("moving backward left with speed of: 160. Position is: " + Math.abs(frame.hands[0].sphereCenter[0]));
                  my.bb8.color(0x0000ff);
                  if(speedFlag != 1) { my.bb8.roll(160, 225); }
                  else { my.bb8.roll(100 + Math.abs(frame.hands[0].sphereCenter[0]), 225); }
                }
                //move backward straight //cyan 00ffff
                else {
                  console.log("moving backward straight with speed of: 160. Position is: " + Math.abs(frame.hands[0].sphereCenter[2]));
                  my.bb8.color(0x00ffff);
                  if(speedFlag != 1) { my.bb8.roll(160, 180); }
                  else { my.bb8.roll(100 + Math.abs(frame.hands[0].sphereCenter[2]), 180); }
                }
              }
              //move right //yellow ffff00
              else if (frame.hands[0].sphereCenter[2] < 50 && frame.hands[0].sphereCenter[2] > -50 && frame.hands[0].sphereCenter[0] > 0) {
                //console.log("moving right with speed of: " + 3*(Math.abs(frame.hands[0].sphereCenter[0])));
                //my.bb8.roll(3*(Math.abs(frame.hands[0].sphereCenter[0])), 45);
                console.log("moving right with speed of: 160. Position is: " + Math.abs(frame.hands[0].sphereCenter[0]));
                my.bb8.color(0xffff00);
                if(speedFlag != 1) { my.bb8.roll(160, 90); }
                else { my.bb8.roll(100 + Math.abs(frame.hands[0].sphereCenter[0]), 90); }
              }
              //move left //purple bf00ff
              else if (frame.hands[0].sphereCenter[2] < 50 && frame.hands[0].sphereCenter[2] > -50 && frame.hands[0].sphereCenter[0] < 0) {
                //console.log("moving left with speed of: " + 3*(Math.abs(frame.hands[0].sphereCenter[0])));
                //my.bb8.roll(3*(Math.abs(frame.hands[0].sphereCenter[0])), 315);
                console.log("moving left with speed of: 160. Position is: " + Math.abs(frame.hands[0].sphereCenter[0]));
                my.bb8.color(0xbf00ff);
                if(speedFlag != 1) { my.bb8.roll(160, 270); }
                else { my.bb8.roll(100 + Math.abs(frame.hands[0].sphereCenter[0]), 270); }
              }
              //stop if not going forward, backward, left, or right  
              else {
                  my.bb8.color(0xFFFFFF);
                  my.bb8.stop();
                }   
        }
      }
      else { //frame.hands.length = 0
          my.bb8.color(0xFFFFFF);
          my.bb8.stop();
      }
    });
  }
}).start();

bb8 = Cylon.MCP.robots.bb8Bot.devices.bb8;
leap = Cylon.MCP.robots.leapBot.devices.leapmotion;