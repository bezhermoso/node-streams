"use strict";


const topic = process.env.TWITTER_TOPIC || "drupal";


const fs = require('fs');
const Twitter = require('Twitter');
const colors = require('colors');

console.log(`Tracking topic: ${topic}`.green)

// API credentials
const credentials = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
};

// Authenticate to Twitter API
const client = new Twitter(credentials);

// Create a stream
const twitterStream = client.stream('/statuses/filter', {track: topic});
twitterStream.on('error', (error) => {
  console.log(`Error: ${error}`.red);
}).on('data', (event) => {
  console.log(event && event.text);
});

// Auto-load plugins :)
const chokidar = require('chokidar');
const watcher = chokidar.watch('./plugins/*/index.js');
watcher.on('add', (file) => {
  try {
    var plugin = require(`./${file}`);
    if (typeof plugin == "function") {
      console.log(`Loading plugin: ${file}`.green)
      plugin(twitterStream, topic);
    } else {
      console.log('Plugin ${file} must be a function.'.red);
    }
  } catch (e) {
    console.log(`Failed loading plugin: ${file}`.red);
    console.log(e);
  }
});

twitterStream.on('error', (error) => {
  throw error;
});
