#!/usr/bin/env node

var config = require('./config');
var distopia = require('./distopia');
var express = require('express');
var dnode = require('dnode');

var app = express.createServer();
app.use(express.static(__dirname));
app.listen(config.distopiaWebServerPort);
console.log('Distopia dnode server listening on localhost:' + config.distopiaWebServerPort);

var server = dnode(function(remote, conn) {
  this.remote = remote;
  this.conn = conn;
  this.distopia = distopia.connect({
    name: conn.id,
    realm: 'first',
    host: config.redisHost,
    port: config.redisPort
  });
  conn.on('end', function() {
    console.log(conn.id + ' dropped connection.');
  });
  console.log(conn.id + ' connected');
  // thin wrappers around distopia:
  this.send = function(to, subject, payload) {
    this.distopia.send(to, subject, payload);
  };
  this.addHandler = function(subject, fn) {
    this.distopia.addHandler(subject, fn);
  };
  this.subscribe = function(channel) {
    this.distopia.subscribe(channel);
  };
  this.monitor = function(fn) {
    this.distopia.monitor(fn);
  }
});
server.listen(app);
