const router = require('express').Router();

router.route('/').get((req, res) => {
  res.send('list all dashboards');      // TODO test this (supertest)!
});

router.route('/:identifier').get((req, res) => {
  res.send('list all widgets in dashboard with id ' + req.params.identifier);
});

module.exports = router;
