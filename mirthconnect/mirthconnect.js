var request = require('request'); // npm install request, https://github.com/mikeal/request

var mirthConnectClient = function(spec) {
  function query() { // url, data (optional), callback
    var url = arguments[0];
    var data = null;
    var callback;
    if (arguments.length == 3) {
      data = arguments[1];
      callback = arguments[2];
    } else {
      callback = arguments[1];
    }
//    console.log('url: ' + url + ', data: ' + data + ', callback: ' + callback);

    request({
      uri: spec.url + url,
      method: data ? 'POST' : 'GET',
      body: data
    }, 
    function(err, response, body) {
      if (err) {
        callback(err);
      } else if (response.statusCode != 200) {
        callback("Received unexpected status " + response.statusCode + " from server"); 
      } else {
        callback(null, JSON.parse(body));
      }
    });
  };

  var client = {};

  client.getChannels = function(callback) {
    query('/api/0/channel/', callback);
  };

  client.getChannelStatuses = function(callback) {
    query('/api/0/channel/status', callback);
  };

  client.getChannel = function(channelId, callback) {
    query('/api/0/channel/' + channelId, callback);
  };

  client.updateChannel = function(channelId, channel, callback) {
    query('/api/0/channel/' + channelId, channel, callback);
  };

  client.getChannelStatus = function(channelId, callback) {
    query('/api/0/channel/' + channelId + '/status', callback);
  };

  client.pauseChannel = function(channelId, callback) {
    query('/api/0/channel/' + channelId + '/pause', callback);
  };

  client.startChannel = function(channelId, callback) {
    query('/api/0/channel/' + channelId + '/start', callback);
  };

  client.stopChannel = function(channelId, callback) {
    query('/api/0/channel/' + channelId + '/stop', callback);
  };

  client.resumeChannel = function(channelId, callback) {
    query('/api/0/channel/' + channelId + '/resume', callback);
  };

  client.getChannelStatistics = function(channelId, callback) {
    query('/api/0/channel/' + channelId + '/statistics', callback);
  };

  client.getUsers = function(callback) {
    query('/api/0/user/', callback);
  };

  client.getUser = function(userId, callback) {
    query('/api/0/user/' + userId, callback);
  };

  client.updateUser = function(userId, user, callback) {
    query('/api/0/user/' + userId, user, callback);
  };

  client.getServerConfiguration = function(callback) {
    query('/api/0/configuration/', callback); 
  };

  client.updateServerConfiguration = function(config, callback) {
    query('/api/0/configuration/', config, callback); 
  };

  client.getVersion = function(callback) {
    query('/api/0/configuration/version', callback); 
  };

  client.getStatus = function(callback) {
    query('/api/0/configuration/status', callback); 
  };

  return client;
};

exports.createClient = function(url) {
  return mirthConnectClient({url: url});
};
