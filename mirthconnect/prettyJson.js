#!/usr/bin/env node

var fs = require('fs');

var filename = process.argv[2];
fs.readFile(filename, 'utf8', function(err, data) {
  if (err) throw err;
  console.log(JSON.stringify(JSON.parse(data), null, 2));
});
