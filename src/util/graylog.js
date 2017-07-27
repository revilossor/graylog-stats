
module.exports = {
  dashboards: () => {
    return new Promise((resolve, reject) => {
      (Math.random() > 0.5) ? resolve() : reject();
    });
  }


};
