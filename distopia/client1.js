#!/usr/bin/env node

var config = require('./config');

config.myName = 'client1';
config.myVersion = '0.0.1';
config.myDescription = 'A first client';


var distopia = require('./distopia'),
  client = distopia.connect(config.myName, config.redisHost, config.redisPort);

client.addHandler('rollcall', function(message) {
  console.log('responding to rollcall request from ' + message.sender);
  client.send(message.sender, 'rollcallResponse', {
    version: config.myVersion,
    description: config.myDescription
  });
});
