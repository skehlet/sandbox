#!/usr/bin/env node

var config = require('./config');
config.myName = 'browser';


var distopia = require('./distopia'),
  client = distopia.connect(config.myName, config.redisHost, config.redisPort);

client.send('public', 'rollcall');

client.addHandler('rollcallResponse', function(message) {
  console.log(message.sender + ' v' + message.payload.version + ' is online');
});


