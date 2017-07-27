let target;

beforeAll(() => {
  target = require('../../src/util/settings');
});

describe('set', () => {

  test('has function', () => {
    expect(target.set).toBeDefined();
    expect(target.set).toBeInstanceOf(Function);
  });

  test('stores a value which can then be got', () => {
    target.set('mockKey', 'mockValue');
    expect(target.get('mockKey')).toBe('mockValue');
  });

  test('setting an existing key overwrites', () => {
    target.set('overwriteMe', 'firstValue');
    target.set('overwriteMe', 'secondValue');
    expect(target.get('overwriteMe')).toBe('secondValue');
  });

});

describe('get', () => {

  test('has function', () => {
    expect(target.get).toBeDefined();
    expect(target.get).toBeInstanceOf(Function);
  });

  test('getting a nonexisting key returns null', () => {
    expect(target.get('nonexisting')).toBe(null);
  });

});

describe('assign', () => {

  const mockAssignObject = {
    username: 'mockUsername',
    password: 'mockPassword'
  };

  beforeAll(() => {
    target.assign(mockAssignObject);
  });

  test('has function', () => {
    expect(target.assign).toBeDefined();
    expect(target.assign).toBeInstanceOf(Function);
  });

  test('sets each tuple in argument', () => {
    for(let key in mockAssignObject) {
      expect(target.get(key)).toBe(mockAssignObject[key]);
    }
  });

});

describe('defaults', () => {

  const defaultAssertions = {
    protocol: 'http',
    host: 'localhost',
    port: 9000
  };

  for(let def in defaultAssertions) {
    test(`default for ${def} is ${defaultAssertions[def]}`, () => {
      expect(target.get(def)).toBe(defaultAssertions[def]);
    });
  }

});
