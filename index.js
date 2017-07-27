const router = require('express').Router(),
  settings = require('./src/util/settings');

router.use('/list', require('./src/route/list'));

module.exports = (options) => {
  settings.assign(options);
  return router;
};
