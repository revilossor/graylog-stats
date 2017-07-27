const data = {
  url: 'localhost',
  port: 9000
};

const set = (key, value) => data[key] = value;
const get = (key) => (data[key]) ? data[key] : null;
const assign = (settings) => { for(let setting in settings) { set(setting, settings[setting]); } };

module.exports = {
  get: get,
  set: set,
  assign: assign
};
