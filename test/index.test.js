describe('index', () => {
  const express = require('express');

  let target;

  beforeAll(() => {
    target = require('../index');
  });

  test('exports a router', () => {
    expect(target).toBeInstanceOf(express.Router().constructor);
  });

});
