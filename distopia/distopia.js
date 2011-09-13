var redis = require('redis'); // npm install redis
var uuid = require('node-uuid'); // npm install node-uuid

var distopiaProtocolVersion = '1';

//exports.connect = function(name, host, port) {
exports.connect = function(options) {
  var name = options.name || uuid();
  var realm = options.realm || 'default';
  var host = options.host || '127.0.0.1';
  var port = options.port || 6379;
  var handlers = [];

  function getChannel(channel) {
    return 'distopia-' + distopiaProtocolVersion + '-' + realm + '-' + channel;
  }
  
  function publish(to, subject, payload) {
    var packet = {
      sender: name,
      subject: subject,
      payload: payload
    };
    pub.publish(getChannel(to), JSON.stringify(packet));
  }
  
  function handleMessage(pattern, channel, message) {
    message = JSON.parse(message);
    var sender = message.sender;
    var subject = message.subject;
    message.date = new Date().toString();
    
    for (var i = 0; i < handlers.length; i++) {
      if (subject.match(handlers[i].pat)) {
        handlers[i].fn(message);
      }
    }
  }

  var pub = redis.createClient(port, host);
  var sub = redis.createClient(port, host);

  sub.on('pmessage', handleMessage);
  sub.psubscribe(getChannel('public')); 
  sub.psubscribe(getChannel(name)); 
  
  var client = {};
  client.send = function(to, subject, payload) {
    publish(to, subject, payload);
  };
  
  client.addHandler = function(subject, fn) {
    handlers.push({pat: subject, fn: fn});
  }
  
  client.subscribe = function(channel, fn) {
    sub.psubscribe(getChannel(channel));
  }
  
  client.monitor = function(fn) {
    var monitor = redis.createClient(port, host);
    monitor.monitor(function(err, res) {
      if (err) throw err;
    });
    monitor.on('monitor', function(time, args) {
      fn(time, args);
    });
  }
  
  return client;
};