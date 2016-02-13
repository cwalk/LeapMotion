var http = require('http');
var Cylon = require('cylon');

var HOSTNAME = '192.168.0.101';
var lastLeft = 0.0, lastRight = 0.0;
var token = "", loggedIn = false;
var lightState = false;
var speedRequest = null;

var intervalReference = setInterval(function (){updateRequest()}, 200); //Only update speed every so many milliseconds


Cylon.robot({

	name: 'eyebot',

  connections: {
    leapmotion: { adaptor: 'leapmotion'}
  },

  devices: {
    leapmotion: { driver: 'leapmotion'}
  },

  work: function(my) {

    //Check for login
    if(loggedIn == false) {
      console.log("Attempting to login to Eyesbot . . . ");
      login();
    }
    
    my.leapmotion.on('frame', function(frame) {
      
        if (frame.hands.length > 0) {

          //console.log(frame.data.gestures);

          if(frame.data.gestures.length > 0) {
            if(lightState == false && frame.data.gestures[0].type == "keyTap"){
              console.log("Should be turning light ON");
              lightswitch('on', token);
              lightState = true;
            }
            else if (lightState == true && frame.data.gestures[0].type == "keyTap") {
              console.log("Should be turning light OFF");
              lightswitch('off', token);
              lightState = false;
            }
            else if (frame.data.gestures[0].type == "screenTap"){
              console.log("Should be taking a picture!");
              takePhoto('on', token);
            }
          }

          if(frame.hands[0].sphereCenter[1] < 200) { //if Y is less than 200, move the robot

            //Move forward
            if (frame.hands[0].sphereCenter[2] < -30) {
                //Move forward left
                if (frame.hands[0].sphereCenter[0] < -50) {
                  sendRequest('1.0','0.5');
                }
                //Move forward right
                else if (frame.hands[0].sphereCenter[0] > 50) {
                  sendRequest('0.5','1.0');
                }
                //Move forward straight
                else {
                  sendRequest('0.5','0.5');
                }
            }
            //Move backward
            else if (frame.hands[0].sphereCenter[2] > 30) {
              //Move backward left
              if (frame.hands[0].sphereCenter[0] < -50) {
                sendRequest('-1.0','-0.5');
              }
              //Move backward right
              else if (frame.hands[0].sphereCenter[0] > 50) {
                sendRequest('-0.5','-1.0');
              }
              //Move backward straight
              else {
                sendRequest('-0.5','-0.5');
              }
            }
          }
          else { //if Y is above 200, stop the robot
            sendRequest('0.0','0.0');
          }
      }
    });
  }
}).start();

function sendRequest(right, left){
  
  if(lastRight == right && lastLeft == left) { //don't update unless the command has changed
    return;
  }
  
  speedRequest = '/robot/?spdb=' + right + '_' + left; 

  console.log('Updating right wheel to: ' + right + ' and left wheel to ' + left);
  if(right == "0.0" && left == "0.0") { console.log("Stopping Eyesbot!"); }

  lastLeft = left;
  lastRight = right;
}

function updateRequest(){
  
  if(speedRequest == null) { //don't update unless the command has changed
    return;
  }

  http.get({
          hostname: HOSTNAME,
          port: 8080,
          path: speedRequest,
          agent: false
        }, (res) => {
  })
  speedRequest = null;
}

function login() {

  var options = {
    hostname: HOSTNAME,
    port: 8080,
    path: '/command/?login=hi',
  };

  http.get(options, function(res) {
    var body = '';
    res.on('data', function(chunk) {
        body += chunk;
    });
    res.on('end', function() {
        //console.log(body);
        parseStatusResponse(body);
    });
    res.on('error', function(e) {
         console.log("Got error: " + e.message);
    });
    body = '';
  })

}

function parseStatusResponse(responseText){
    
    var parsedResponse = responseText.split("\r\n");
    
    for(var i=0; i<parsedResponse.length; i++){
        var line = parsedResponse[i];
        if(line.indexOf("loggedin:true") == 0){
            loggedIn=true;
            console.log("Eyesbot login was successful!");
        }
        else if(line.indexOf("loggedin:false") == 0){
            loggedIn=false;
            console.log("Eyesbot login was unsuccessful :(");
        }
        else if(line.indexOf("token:") == 0){
            token=line.substring(6);
        }
    }
}

function lightswitch(value, token) {
  http.get({
          hostname: HOSTNAME,
          port: 8080,
          path: '/command/?lights=' + value + '&token='+ token,
          agent: false
        }, (res) => {
          console.log("light should be " + value);
  })
}

function takePhoto(value, token) {
  http.get({
          hostname: HOSTNAME,
          port: 8080,
          path: '/command/?photo=' + value + '&token='+ token,
          agent: false
        }, (res) => {
          console.log("Picture taken!");
  })
}

//Take the x/y position of the hand, divide values by 10 and floor them to an integer