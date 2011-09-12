var redis = require('redis');

var distopiaVersion = '0.0.1';

exports.connect = function(name, host, port) {
  var handlers = [];

  function getChannel(channel) {
    return 'distopia-' + distopiaVersion + '-' + channel;
  }
  
  function publish(to, subject, payload) {
    var packet = {
      sender: name,
      subject: subject,
      payload: payload
    };
    pub.publish(getChannel(to), JSON.stringify(packet));
  }
  
  function handleMessage(channel, message) {
    message = JSON.parse(message);
    var sender = message.sender;
    var subject = message.subject;
    
    for (var i = 0; i < handlers.length; i++) {
      if (subject.match(handlers[i].pat)) {
        handlers[i].fn(message);
      }
    }
  }

  var pub = redis.createClient(port, host);
  var sub = redis.createClient(port, host);

  sub.on('message', handleMessage);
  sub.subscribe(getChannel('public')); 
  sub.subscribe(getChannel(name)); 
  
  var client = {};
  client.send = function(to, subject, payload) {
    publish(to, subject, payload);
  };
  
  client.addHandler = function(subject, fn) {
    handlers.push({pat: subject, fn: fn});
  }
  
  return client;
};