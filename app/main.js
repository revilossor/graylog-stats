const app = require('express')();

app.use('/', require('../index')({
  username: 'admin',
  password: 'password'
}));

app.listen('8080');
