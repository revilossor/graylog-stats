let target, promise;

beforeAll(() => {
  target = require('../../src/util/graylog');
});

describe('dashboards()', () => {
  beforeAll((done) => {
    promise = target.dashboards().then(() => {
      done();
    });
  });

  test('function exists', () => {
    expect(target.dashboards).toBeDefined();
    expect(target.dashboards).toBeInstanceOf(Function);
  });

  test('returns a promise', () => {
    expect(promise).toBeInstanceOf(Promise);
  });

});
