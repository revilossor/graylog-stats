describe('index', () => {
  const express = require('express'),
    settings = require('../src/settings');

  let target, result;

  beforeAll(() => {
    jest.spyOn(settings, ['set']);
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

});
