let target, instance, value;

beforeAll(() => {
  target = require('../../src/util/cache');
  instance = target();
});

test('it is a factory', () => {
  expect(target).toBeInstanceOf(Function);
  const newInstance = target();
  expect(newInstance).toBeInstanceOf(instance.constructor);
});

describe('instance', () => {

  test('has a get function', () => {
    expect(instance.get).toBeDefined();
    expect(instance.get).toBeInstanceOf(Function);
  });

  test('has a set function', () => {
    expect(instance.set).toBeDefined();
    expect(instance.set).toBeInstanceOf(Function);
  });

});

describe('set', () => {

  beforeAll(() => {
    value = instance.set('mock', 'someItem');
  });

  test('stores an item which can be retrieved with get', () => {
    expect(instance.get('mock')).toBe('someItem');
  });

  test('overwrites an item with the same key', () => {
    instance.set('mock', 'somethingElse');
    expect(instance.get('mock')).toBe('somethingElse');
  });

  test('return the item', () => {
    expect(value).toEqual('someItem');
  });

});

describe('get', () => {

  beforeAll(() => {
    instance = target(50);
  });

  test('returns the data if younger than cache time', () => {
    instance.set('mock', 123);
    expect(instance.get('mock')).toBe(123);
  });

  test('returns null if older than cache time', (done) => {
    instance.set('something', 456);
    setTimeout(() => {
      expect(instance.get('something')).toEqual(null);
      done();
    }, 60);
  });

});
