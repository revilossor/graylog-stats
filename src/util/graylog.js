const settings = require('./settings'),
  request = require('request'),
  dashboardCache = require('./cache')(3600000); // caches calls for dashboard stuff for an hour

const getBasepath = () => {
  const username = settings.get('username'),
    password = settings.get('password');
  const credentials = (username && password) ? username + ':' + password + '@' : '';
  return `${settings.get('protocol')}://${credentials}${settings.get('host')}:${settings.get('port')}`;
};

const jsonRequest = (uri) => {
  return new Promise((resolve, reject) => {
    request({
      uri: uri,
      method: 'GET',
      json: true
    }, (error, response, body) => {
      if(error) { return reject(error); }
      if(response.statusCode !== 200) { return reject(new Error(`request to ${uri} is ${response.statusCode}`));}
      resolve(body);
    });
  });
};

module.exports = {
  dashboards: () => {
    const uri = `${getBasepath()}/api/dashboards`;
    const cached = dashboardCache.get(uri);
    return new Promise((resolve, reject) => {
      if(cached) {
        resolve(cached);
      } else {
        jsonRequest(`${getBasepath()}/api/dashboards`).then((result) => {
          const datum = result.dashboards.map((dashboard) => ({
            description: dashboard.description,
            id: dashboard.id,
            title: dashboard.title,
            widgets: dashboard.widgets.map((widget) => ({
              description: widget.description,
              id: widget.id,
              title: widget.title,
              type: widget.type
            }))
          }));
          resolve(dashboardCache.set(uri, datum));
        }).catch(reject);
      }
    });
  },
  widgets: (id) => {  
    return new Promise((resolve, reject) => {
      jsonRequest(`${getBasepath()}/api/dashboards/${id.dashboard}/widgets/${id.widget}/value`).then((value) => {
        resolve({
          description: id.data.widget.description,
          id: id.widget,
          type: id.data.widget.type,
          values: value.result
        });
      }).catch(reject);
    });
  }
};
