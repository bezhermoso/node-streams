"use strict";

const fs = require("fs");

module.exports = function (stream, topic) {
  var log = fs.createWriteStream(`${topic}.log`);
  var errorLog = fs.createWriteStream(`${topic}-error.log`);
  stream.on('data', (event) => {
    if (event) {
      log.write(event.text);
    }
  }).on('error', (error) => {
    log.write(null);
    errorLog.write(error.message);
    errorLog.write(null);
  });

};
