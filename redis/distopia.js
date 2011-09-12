var redis = require('redis');

var distopiaVersion = '0.0.1';

exports.connect = function(name, host, port) {

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
    
    if (handlers.hasOwnProperty(subject)) {
      for (idx in handlers[subject]) {
        console.log('firing handler for ' + subject);
        handlers[subject][idx](message);
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
  
  var handlers = {};
  client.addHandler = function(subject, fn) {
    if (!handlers.hasOwnProperty(subject)) {
      handlers[subject] = [];
    }
    handlers[subject].push(fn);
  }
  
  return client;
};