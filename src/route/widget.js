const router = require('express').Router(),
  identify = require('../util/identify'),
  graylog = require('../util/graylog');

router.route('/:dashboardIdentifier/:widgetIdentifier').get((req, res) => {
  identify(req.params.dashboardIdentifier, req.params.widgetIdentifier).then((id) => {
    if(!id.dashboard) { return res.status(404).send(`no dashboard with identifier "${req.params.dashboardIdentifier}"`); }
    if(!id.widget) { return res.status(404).send(`no widget with identifier "${req.params.widgetIdentifier}"`); }
    graylog.widget(id).then((value) => {
      res.json(value);
    });
  });
});

module.exports = router;
