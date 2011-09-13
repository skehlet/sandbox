#!/usr/bin/env node

var config = require('./config');

config.myName = 'client1';
config.myRealm = 'first';
config.myVersion = '0.0.1';
config.myDescription = 'A first client';

var distopia = require('./distopia').connect({ 
  name: config.myName,
  realm: config.myRealm,
  host: config.redisHost,
  port: config.redisPort
});

distopia.addHandler('rollcall', function(message) {
  console.log('responding to rollcall request from ' + message.sender);
  distopia.send(message.sender, 'rollcallResponse', {
    version: config.myVersion,
    description: config.myDescription
  });
});
