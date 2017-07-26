const express = require('express');

let target;

beforeAll(() => {
  jest.spyOn(express.Router, ['route']);
  target = require('../../src/route/list');
});

test('exports a router', () => {
  expect(target).toBeInstanceOf(express.Router().constructor);
});

describe('"/" route', () => {
  test('is defined', () => {
    expect(express.Router.route).toHaveBeenCalledWith('/');
  });
});

describe('"/[identifier]" route', () => {
  test('is defined', () => {
    expect(express.Router.route).toHaveBeenCalledWith('/:identifier');
  });
});
