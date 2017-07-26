const express = require('express'),
  settings = require('../src/util/settings');

let target, result;

const routeAssertions = [
  { endpoint: '/list', mock: jest.fn(), path: '../src/route/list' }
];

beforeAll(() => {
  routeAssertions.forEach((mock_assertion) => {
    jest.mock(mock_assertion.path, () => mock_assertion.mock);
  });
  jest.spyOn(settings, ['set']);
  jest.spyOn(express.Router, ['use']);
  target = require('../index');
  result = target('mockUsername', 'mockPassword');
});

test('is a router factory', () => {
  expect(result).toBeInstanceOf(express.Router().constructor);
});

test('stores first constructor arg as username in settings', () => {
  expect(settings.set).toHaveBeenCalledWith('username', 'mockUsername');
});

test('stores second constructor arg as password in settings', () => {
  expect(settings.set).toHaveBeenCalledWith('password', 'mockPassword');
});

describe('errors', () => {
  test('throws if no username passed', () => {
    expect(() => { target(); }).toThrowError('greylog-stats expects your graylog username as first argument!');
  });
  test('throws if username isnt a string', () => {
    expect(() => { target(123, 'mockPassword'); }).toThrowError('username argument to greylog-stats should be a string!');
  });
  test('throws if no password passed', () => {
    expect(() => { target('mockUsername'); }).toThrowError('greylog-stats expects your graylog password as second argument!');
  });
  test('throws if password isnt a string', () => {
    expect(() => { target('mockUsername', 123); }).toThrowError('password argument to greylog-stats should be a string!');
  });
});

describe('routes', () => {
  routeAssertions.forEach((assertion) => {
    test(`uses router from "${assertion.path}" for "${assertion.endpoint}"`, () => {
      expect(express.Router.use).toHaveBeenCalledWith(assertion.endpoint, assertion.mock);
    });
  });
});
