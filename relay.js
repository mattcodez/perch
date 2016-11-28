/*The relay-exp-addon is from opkg and I couldn't find an easy way to
work with it on my local development laptop. So, let's just provide empty
functions for all the calls*/
'use strict';
let relayAddon;
try{
  relayAddon = require("/usr/bin/relay-exp-addon");
}
catch(e){
  //We're not on an Omega, fake it
  console.error('relay-exp-addon not found, faking with no functionality');
  relayAddon = new Proxy({}, {
    get(target, name, receiver) {
      DEBUG_MODE && console.log(`Trying to run relayAddon.${name}`);
      return ()=>{};
    }
  });
}
module.exports = relayAddon;
