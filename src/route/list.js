const router = require('express').Router(),
  graylog = require('../util/graylog'),
  identify = require('../util/identify');

router.route('/').get((req, res) => {
  graylog.dashboards().then((result) => {
    res.json(result);
  }).catch((err) => {
    res.status(500).send(err);
  });
});

router.route('/:identifier').get((req, res) => {    // identifier can be id or title
  identify(req.params.identifier).then((id) => {
    id.dashboard ?
      res.json(id.data.dashboard) :
      res.status(404).send(`no dashboard with identifier "${req.params.identifier}"`);
  }).catch((err) => {
    res.status(500).send(err);
  });
});

module.exports = router;
