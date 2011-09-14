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
  console.log(conn.id + ' connected');
  conn.on('end', function() {
    _distopia.end();
    console.log(conn.id + ' dropped connection.');
  });

  var _distopia = distopia.connect({
    name: conn.id,
    realm: 'first',
    host: config.redisHost,
    port: config.redisPort
  });

  // proxy these methods
  this.send = _distopia.send;
  this.handleSubject = _distopia.handleSubject;
  this.subscribe = _distopia.subscribe;
  this.psubscribe = _distopia.psubscribe;
  this.monitor = _distopia.monitor;
});
server.listen(app);
