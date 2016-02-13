var Cylon = require('cylon');

Cylon.robot({
  connections: {
    // bluetooth: { adaptor: 'central', uuid: '4d131c5eb1d24763ae6253342020d5f4', module: 'cylon-ble'}
    bluetooth: { adaptor: 'central', uuid: 'a071187bc76c412c83cf33cbddfcec03', module: 'cylon-ble'}
  },

  devices: {
    bb8: { driver: 'bb8', module: 'cylon-sphero-ble'}
  },

  work: function(my) {
      console.log("wake");
      //my.bb8.spin('right', 150);
      my.bb8.roll(1000, 260);

      after(200, function() {
        my.bb8.color(0x00FFFF);
      });
  }
}).start();