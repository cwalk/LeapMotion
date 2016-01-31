var Cylon = require('cylon');

Cylon.robot({
  connections: {
    leapmotion: { adaptor: 'leapmotion' }
  },

  devices: {
    leapmotion: { driver: 'leapmotion' }
  },

  work: function(my) {
    my.leapmotion.on('frame', function(payload) { //also can change frame to hand to get different data
      //console.log(payload.toString());  //to log out all leapmotion data
      if(payload.data.gestures.length > 0)
        console.log(payload.data.gestures); //to log out leapmotion data related to gestures
    });
  }
}).start();