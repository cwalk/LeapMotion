"use strict";

var Cylon = require("cylon");

Cylon.robot({
  connections: {
    bluetooth: { adaptor: 'central', uuid: '4d131c5eb1d24763ae6253342020d5f4', module: 'cylon-ble'}
  },

  devices: {
    bb8: { driver: 'bb8', module: 'cylon-sphero-ble'}
  },

  work: function(my) {
    every((1).second(), function() {
      // We tell sphero to change the color of its
      // RGB LED to a random value.
      // We can also use `my.sphero.color(0x00FF00);`
      // if we want an specific color.
      my.bb8.randomColor();
    });
  }
}).start();