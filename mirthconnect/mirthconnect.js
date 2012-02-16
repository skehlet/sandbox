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
    query('/api/channel/', callback);
  };

  client.getChannelStatuses = function(callback) {
    query('/api/channel/status', callback);
  };

  client.getChannel = function(channelId, callback) {
    query('/api/channel/' + channelId, callback);
  };

  client.updateChannel = function(channelId, channel, callback) {
    query('/api/channel/' + channelId, channel, callback);
  };

  client.getChannelStatus = function(channelId, callback) {
    query('/api/channel/' + channelId + '/status', callback);
  };

  client.pauseChannel = function(channelId, callback) {
    query('/api/channel/' + channelId + '/pause', callback);
  };

  client.startChannel = function(channelId, callback) {
    query('/api/channel/' + channelId + '/start', callback);
  };

  client.stopChannel = function(channelId, callback) {
    query('/api/channel/' + channelId + '/stop', callback);
  };

  client.resumeChannel = function(channelId, callback) {
    query('/api/channel/' + channelId + '/resume', callback);
  };

  client.getChannelStatistics = function(channelId, callback) {
    query('/api/channel/' + channelId + '/statistics', callback);
  };

  client.getStatistics = function(callback) {
    query('/api/channel/statistics', callback);
  };

  client.getUsers = function(callback) {
    query('/api/user/', callback);
  };

  client.getUser = function(userId, callback) {
    query('/api/user/' + userId, callback);
  };

  client.updateUser = function(userId, user, callback) {
    query('/api/user/' + userId, user, callback);
  };

  client.getServerConfiguration = function(callback) {
    query('/api/configuration/', callback); 
  };

  client.updateServerConfiguration = function(config, callback) {
    query('/api/configuration/', config, callback); 
  };

  client.getVersion = function(callback) {
    query('/api/configuration/version', callback); 
  };

  client.getStatus = function(callback) {
    query('/api/configuration/status', callback); 
  };

  return client;
};

exports.createClient = function(url) {
  return mirthConnectClient({url: url});
};
