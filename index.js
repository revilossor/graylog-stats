const router = require('express').Router(),
  settings = require('./src/util/settings');

router.use('/list', require('./src/route/list'));
router.use('/widget', require('./src/route/widget'));

module.exports = (options) => {
  settings.assign(options);
  return router;
};
