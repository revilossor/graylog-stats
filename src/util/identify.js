const graylog = require('./graylog'),
  finder = require('object-finder');

function get(data, identifier) {
  let found = finder({ id: identifier }, data);
  if(found.length === 0) { found = finder({ title: identifier}, data); }
  return (found.length === 0) ? null : found[0];
}

module.exports = (dashboard, widget) => {
  let foundDashboard, foundWidget;
  return new Promise((resolve, reject) => {
    graylog.dashboards().then((dashboards) => {
      foundDashboard = get(dashboards, dashboard);
      if(widget && foundDashboard) { foundWidget = get(foundDashboard.widgets, widget); }
      resolve({
        dashboard: (foundDashboard) ? foundDashboard.id : null,
        widget: (foundWidget) ? foundWidget.id : null,
        data: {
          dashboard: (foundDashboard) ? foundDashboard : null,
          widget: (foundWidget) ? foundWidget : null
        }
      });
    }).catch(reject);
  });
};
