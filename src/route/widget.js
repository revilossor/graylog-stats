const router = require('express').Router(),
  identify = require('../util/identify'),
  graylog = require('../util/graylog');

router.route('/:dashboardIdentifier').get((req, res) => {
  identify(req.params.dashboardIdentifier).then((id) => {
    if(!id.dashboard) { return res.status(404).send(`no dashboard with identifier "${req.params.dashboardIdentifier}"`); }
    Promise.all(id.data.dashboard.widgets.map(widget => graylog.widgets({
      dashboard: id.dashboard,
      widget: widget.id,
      data: {
        dashboard: id.data.dashboard,
        widget: widget
      }
    }))).then(result => res.json(result)).catch(err => res.status(500).send(err.message));
  });
});

router.route('/:dashboardIdentifier/:widgetIdentifier').get((req, res) => {
  identify(req.params.dashboardIdentifier, req.params.widgetIdentifier).then((id) => {
    if(!id.dashboard) { return res.status(404).send(`no dashboard with identifier "${req.params.dashboardIdentifier}"`); }
    if(!id.widget) { return res.status(404).send(`no widget with identifier "${req.params.widgetIdentifier}"`); }
    graylog.widgets(id).then((value) => {
      res.json(value);
    }).catch((err) => {
      res.status(500).send(err.message);
    });
  });
});

module.exports = router;
