const settings = require('./settings'),
  request = require('request');

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
    return new Promise((resolve, reject) => {
      jsonRequest(`${getBasepath()}/api/dashboards`).then((result) => {
        resolve(result);
      }).catch(reject);
    });
  }
};
