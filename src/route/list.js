const router = require('express').Router(),
  graylog = require('../util/graylog');

router.route('/').get((req, res) => {
  graylog.dashboards().then((result) => {
    res.json(result);
  }).catch((err) => {
    res.status(500).send(err);
  });
});

router.route('/:identifier').get((req, res) => {
  res.send('list all widgets in dashboard with id ' + req.params.identifier);
});

module.exports = router;
