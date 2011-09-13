#!/usr/bin/env node

var config = require('./config');
var distopia = require('./distopia');

var express = require('express');
var app = express.createServer();
app.use(express.static(__dirname));

app.listen(8080);
console.log('Server listening on http://localhost:8080/');

// then just pass the server app handle to .listen()!

var dnode = require('dnode');
var server = dnode(function(remote, conn) {
  this.remote = remote;
  this.conn = conn;
  this.client = distopia.connect(conn.id, config.redisHost, config.redisPort);
  conn.on('end', function() {
    console.log(conn.id + ' dropped connection.');
  });
  console.log(conn.id + ' connected');
  this.send = function(to, subject, payload) {
    this.client.send(to, subject, payload);
  };
  this.addHandler = function(subject, fn) {
    this.client.addHandler(subject, fn);
  };
  this.subscribe = function(channel) {
    this.client.subscribe(channel);
  };
});
server.listen(app);
