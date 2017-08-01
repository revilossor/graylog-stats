const router = require('express').Router(),
  graylog = require('../util/graylog'),
  find = require('object-finder');

router.route('/').get((req, res) => {
  graylog.dashboards().then((result) => {
    res.json(result);
  }).catch((err) => {
    res.status(500).send(err);
  });
});

router.route('/:identifier').get((req, res) => {    // identifier can be id or title
  graylog.dashboards().then((result) => {
    let found = find({ id: req.params.identifier }, result);
    if(found.length === 0) {
      found = find({ title: req.params.identifier }, result);
    }
    res.json(found);
  }).catch((err) => {
    res.status(500).send(err);
  });
});

module.exports = router;
