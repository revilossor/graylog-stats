let target;

beforeAll(() => {
  target = require('../../src/util/settings');
});

test('has get function', () => {
  expect(target.get).toBeDefined();
  expect(target.get).toBeInstanceOf(Function);
});

test('has set function', () => {
  expect(target.set).toBeDefined();
  expect(target.set).toBeInstanceOf(Function);
});

test('set stores a value which can then be got', () => {
  target.set('mockKey', 'mockValue');
  expect(target.get('mockKey')).toBe('mockValue');
});

test('get a nonexisting key returns null', () => {
  expect(target.get('nonexisting')).toBe(null);
});

test('setting an existing key overwrites', () => {
  target.set('overwriteMe', 'firstValue');
  target.set('overwriteMe', 'secondValue');
  expect(target.get('overwriteMe')).toBe('secondValue');
});
