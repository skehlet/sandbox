#!/opt/node/bin/node

var config = require('./config');
var distopia = require('./distopia').connect({
  name: 'firewallRejectWatch',
  version: '0.0.1',
  description: 'Watches /var/log/firewall on mirthhq for firewall Rejected messages.',
  realm: config.distopiaRealm,
  host: config.redisHost,
  port: config.redisPort
});

var spawn = require('child_process').spawn;
var tail = spawn('tail', ['-F', '/var/log/firewall']);
tail.stdout.setEncoding('utf8');
tail.stdout.on('data', function(data) {
  var lines = data.split(/\r?\n/);
  for (var i = 0; i < lines.length; i++) {
    if (lines[i] == '') continue;
    console.log('examining: ' + lines[i]);

    // Rejected: IN=tun0 OUT=tun2 SRC=172.22.20.72 DST=172.22.28.24 LEN=1390 TOS=0x00 PREC=0x00 TTL=63 ID=40393 DF PROTO=TCP SPT=8888 DPT=53318 WINDOW=332 RES=0x00 ACK URGP=0 
    if (lines[i].match(/^Rejected: /)) {
      var pieces = lines[i].split(/\s+/);
      var src;
      var dst;
      var proto;
      var sport;
      var dport;

      var matchTbl = {
        src: 'SRC=',
        dst: 'DST=',
        proto: 'PROTO=',
        sport: 'SPT=',
        dport: 'DPT='
      };

      var values = {};
      for (var j = 0; j < pieces.length; j++) {
        for (var key in matchTbl) {
          var label = matchTbl[key];
          if (pieces[j].match(new RegExp('^' + label + '(.*)'))) {
console.log('matched ' + key + ', saving ' + RegExp.$1);
            values[key] = RegExp.$1;
            break;
          }
        }
      }

      distopia.send('firewallRejectWatchOut', 'reject', values);
    }
  }
});
