const data = {};
module.exports = {
  get: (key) => (data[key]) ? data[key] : null,
  set: (key, value) => data[key] = value
};
