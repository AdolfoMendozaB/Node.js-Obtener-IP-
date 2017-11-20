  'use strict';
  function capturaip() {
    var os = require('os');
    var ifaces = os.networkInterfaces();
    var ip;

    Object.keys(ifaces).forEach(function (ifname) {
      var alias = 0;
      ifaces[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
        }

        if (alias >= 1) {
          console.log(ifname + ':' + alias, iface.address);
        } else {
          console.log(iface.address);
          ip = iface.address;
        }
        ++alias;
      });
    });
    return ip;
  }

  module.exports = {
    database: 'mongodb://'+capturaip()+':27017/x',
    secret: '26623268'
  }