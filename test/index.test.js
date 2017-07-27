const express = require('express'),
  settings = require('../src/util/settings');

let target, result;

const routeAssertions = [
  { endpoint: '/list', mock: jest.fn(), path: '../src/route/list' }
];

const mockSettings = {
  username: 'mockUsername',
  password: 'mockPassword'
};

beforeAll(() => {
  routeAssertions.forEach((mock_assertion) => {
    jest.mock(mock_assertion.path, () => mock_assertion.mock);
  });
  jest.spyOn(settings, ['assign']);
  jest.spyOn(express.Router, ['use']);
  target = require('../index');
  result = target(mockSettings);
});

test('is a router factory', () => {
  expect(result).toBeInstanceOf(express.Router().constructor);
});

test('passes settings object to settings::assign()', () => {
  expect(settings.assign).toHaveBeenCalledWith(expect.objectContaining(mockSettings));
});

describe('routes', () => {
  routeAssertions.forEach((assertion) => {
    test(`uses router from "${assertion.path}" for "${assertion.endpoint}"`, () => {
      expect(express.Router.use).toHaveBeenCalledWith(assertion.endpoint, assertion.mock);
    });
  });
});
