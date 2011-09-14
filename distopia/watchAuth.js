#!/opt/node/bin/node

var config = require('./config');
var distopia = require('./distopia').connect({
  name: 'authWatch',
  version: '0.0.1',
  description: 'Watches /var/log/auth on mirthhq for Authentication messages.',
  realm: config.distopiaRealm,
  host: config.redisHost,
  port: config.redisPort
});

var spawn = require('child_process').spawn;
var tail = spawn('tail', ['-F', '/var/log/secure']);
tail.stdout.setEncoding('utf8');
tail.stdout.on('data', function(data) {
  var lines = data.split(/\r?\n/);
  for (var i = 0; i < lines.length; i++) {
    if (lines[i] == '') continue;
    console.log('examining: ' + lines[i]);
    // Authenticated WR100049 via Hq3WebServicesAuthenticator
    if (lines[i].match(/(Authenticated \S+ via \S+)/)) {
      console.log('publishing!');
      distopia.send('authWatchOut', 'authentication', RegExp.$1);
    }
  }
});
