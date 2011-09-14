var redis = require('redis'); // npm install redis
var uuid = require('node-uuid'); // npm install node-uuid

var distopiaProtocolVersion = '1';

exports.connect = function(options) {
  var name = options.name || uuid();
  var version = options.version || 'unknown';
  var description = options.description || '';
  var realm = options.realm || 'default';
  var host = options.host || '127.0.0.1';
  var port = options.port || 6379;
  var handlers = [];

  function getChannel(channel) {
    return 'distopia-' + distopiaProtocolVersion + '-' + realm + '-' + channel;
  }
  
  function publish(to, subject, contents) {
    var message = {
      time: new Date().getTime(),
      sender: name,
      subject: subject,
      contents: contents
    };
    var serializedMessage = JSON.stringify(message);
    pub.publish(getChannel(to), serializedMessage);
  }
  
  function handleSerializedMessage(serializedMessage) {
    try {
      var message = JSON.parse(serializedMessage);
      if (message.sender == name) {
        return;
      }
      message.date = new Date(message.time);
      for (var i = 0; i < handlers.length; i++) {
        if (message.subject.match('^' + handlers[i].pat + '$')) {
          handlers[i].fn(message);
        }
      }
    } catch (err) {
      console.log('skipping bad JSON message');
    }
  }

  var pub = redis.createClient(port, host);
  var sub = redis.createClient(port, host);

  sub.on('message', function(channel, serializedMessage) {
    console.log('message handler fired, channel: ' + channel + ', message:' + serializedMessage);
    handleSerializedMessage(serializedMessage);
  });
  sub.on('pmessage', function(pattern, channel, serializedMessage) {
    console.log('pmessage handler fired, pattern: ' + pattern, ', channel: ' + channel + ', message:' + serializedMessage);
    handleSerializedMessage(serializedMessage);
  });

  sub.subscribe(getChannel('public')); 
  sub.subscribe(getChannel(name));
  
  var api = {};
  api.send = function(to, subject, contents) {
    publish(to, subject, contents);
  };
  
  api.handleSubject = function(subject, fn) {
    handlers.push({pat: subject, fn: fn});
  }
  
  api.subscribe = function(channel) {
    sub.subscribe(getChannel(channel));
  }
  
  api.psubscribe = function(channel) {
    sub.psubscribe(getChannel(channel));
  }

  api.monitor = function(fn) {
    var monitor = redis.createClient(port, host);
    monitor.monitor(function(err, res) {
      if (err) throw err;
    });
    monitor.on('monitor', function(time, args) {
      fn(time, args);
    });
  }
  
  api.end = function() {
    pub.end();
    sub.end();
  }
  
  function rollcallResponse(to) {
    api.send(to, 'rollcallResponse', {
      version: version,
      description: description,
    });
  }
  
  rollcallResponse('public');

  api.handleSubject('rollcall', function(message) {
    console.log('responding to rollcall request from ' + message.sender);
    rollcallResponse(message.sender);
  });
  
  return api;
};