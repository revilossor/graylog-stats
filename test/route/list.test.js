const express = require('express'),
  request = require('supertest');

let target, app;

let mockDashboardRejects = false;
const mockError = new Error('mockError!');
let mockDashboardResult = { value: 'mockDashboardResult' };
const mockDashboards = jest.fn().mockImplementation(() => new Promise((resolve, reject) => {
  (mockDashboardRejects) ? reject(mockError) : resolve(mockDashboardResult);
}));

beforeAll(() => {
  jest.spyOn(express.Router, ['route']);
  jest.mock('../../src/util/graylog', () => ({
    dashboards: mockDashboards
  }));
  target = require('../../src/route/list');
  app = express();
  app.use('/', target);
});

beforeEach(() => {
  mockDashboards.mockClear();
});

test('exports a router', () => {
  expect(target).toBeInstanceOf(express.Router().constructor);
});

describe('"/" route', () => {
  test('is defined', () => {
    expect(express.Router.route).toHaveBeenCalledWith('/');
  });
  test('calls graylog::dashboards', (done) => {
    request(app).get('/').then(() => {
      expect(mockDashboards).toHaveBeenCalled();
      done();
    });
  });
  test('responds with graylog::dashboards result resolves', (done) => {
    request(app).get('/').then((response) => {
      expect(response.body).toEqual(expect.objectContaining(mockDashboardResult));
      done();
    });
  });
  test('status 500 if graylog::dashboards rejects', (done) => {
    mockDashboardRejects = true;
    request(app).get('/').then((response) => {
      expect(response.status).toBe(500);
      mockDashboardRejects = false;
      done();
    });
  });
});

describe('"/[identifier]" route', () => {
  test('is defined', () => {
    expect(express.Router.route).toHaveBeenCalledWith('/:identifier');
  });
  test('calls graylog::dashboards', (done) => {
    request(app).get('/blah').then(() => {
      expect(mockDashboards).toHaveBeenCalled();
      done();
    });
  });
  test('responds with correct dashboard when id in url', (done) => {
    mockDashboardResult = [{ id: 'mockDashboardId' }, { id: 'somethingElse'} ];
    request(app).get('/mockDashboardId').then((response) => {
      expect(response.body).toEqual(expect.arrayContaining([{ id: 'mockDashboardId' }]));
      done();
    });
  });
  test('responds with correct dashboard when title in url', (done) => {
    mockDashboardResult = [{ title: 'mockDashboardTitle' }, { title: 'somethingElse'} ];
    request(app).get('/mockDashboardTitle').then((response) => {
      expect(response.body).toEqual(expect.arrayContaining([{ title: 'mockDashboardTitle' }]));
      done();
    });
  });
  test('status 500 if graylog::dashboards rejects', (done) => {
    mockDashboardRejects = true;
    request(app).get('/blah').then((response) => {
      expect(response.status).toBe(500);
      mockDashboardRejects = false;
      done();
    });
  });
});
