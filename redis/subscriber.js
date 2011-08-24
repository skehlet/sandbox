#!/usr/bin/env node

var redis = require('redis'),
  client = redis.createClient();


client.on('pmessage', function(pattern, channel, message) {
  console.log('[' + pattern + "][" + channel + "]: " + message);
});

console.log("waiting for messages...");
client.psubscribe("*"); 
