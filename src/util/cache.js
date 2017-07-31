const data = {};
module.exports = (maxAge = 3600000) => ({
  get: (key) => {
    const entry = data[key];
    return (!entry || Date.now() - entry.timestamp > maxAge) ? null : entry.datum;
  },
  set: (key, value) => {
    data[key] = { timestamp: Date.now(), datum: value };
    return value;
  }
});
