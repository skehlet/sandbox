#!/usr/bin/env node

var _ = require('underscore');
var async = require('async');

var mirthconnect = require('./mirthconnect'),
client = mirthconnect.createClient('http://localhost:8081');

client.getVersion(function(err, version) {
  console.log('Mirth Connect ' + version);
});

client.getChannels(function(err, channels) {
  if (err) throw err;
  console.log(JSON.stringify(channels, null, 2));

  _.each(channels, function(channel) {
    console.log(channel.id + ' ' + channel.name);

    client.getChannel(channel.id, function(err, channel) {
      if (err) throw err;
      console.log(JSON.stringify(channel, null, 2));

      client.getChannelStatus(channel.id, function(err, status) {
        if (err) throw err;
        console.log(JSON.stringify(status, null, 2))
        console.log(status.channelId + ' ' + status.name + ' ' + status.state + ' ' + new Date(status.deployedDate));
      });

    });      
  });
});

client.getUsers(function(err, users) {
  if (err) throw err;
  _.each(users, function(user) {
    console.log('User: ' + user.username);
  });
});