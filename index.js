const router = require('express').Router(),
  settings = require('./src/settings');

module.exports = (username, password) => {
  settings.set('username', username);
  settings.set('password', password);
  return router;
};
