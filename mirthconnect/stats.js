#!/usr/bin/env node

var _ = require('underscore');
var async = require('async');

var mirthconnect = require('./mirthconnect'),
client = mirthconnect.createClient('http://localhost:8081');

client.getStatistics(function(err, stats) {
  console.log(stats);
});
