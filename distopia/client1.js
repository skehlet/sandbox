#!/usr/bin/env node

var config = require('./config');

var distopia = require('./distopia').connect({ 
  name: 'client1',
  version: '0.0.1',
  description: 'A first client',
  realm: 'first',
  host: config.redisHost,
  port: config.redisPort
});
