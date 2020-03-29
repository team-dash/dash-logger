'use strict';


const ip = require('ip');


function getLocalIp() {
  return ip.address();
}


module.exports = {
  getLocalIp
};
