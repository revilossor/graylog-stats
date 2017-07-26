const router = require('express').Router(),
  settings = require('./src/util/settings');

router.use('/list', require('./src/route/list'));

module.exports = (username, password) => {
  if(!username) { throw new Error('greylog-stats expects your graylog username as first argument!'); }
  if(!password) { throw new Error('greylog-stats expects your graylog password as second argument!'); }
  if(typeof username !== 'string') { throw new Error('username argument to greylog-stats should be a string!'); }
  if(typeof password !== 'string') { throw new Error('password argument to greylog-stats should be a string!'); }
  settings.set('username', username);
  settings.set('password', password);
  return router;
};
