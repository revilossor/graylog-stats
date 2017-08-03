const express = require('express'),
  request = require('supertest');

let mockIdentifyResolution = { mock: 'thing' };
let mockIdentifyError = new Error('mockIdentifyError');
let mockIdentifyRejects = false;

const mockIdentify = jest.fn().mockImplementation(() => new Promise((resolve, reject) => {
  mockIdentifyRejects ? reject(mockIdentifyError) : resolve(mockIdentifyResolution);
}));

let target, app;

beforeAll(() => {
  jest.mock('../../src/util/identify', () => mockIdentify);
  target = require('../../src/route/widget');
  app = express();
  app.use('/', target);
});

beforeEach(() => {
  mockIdentify.mockClear();
});

test('requests identity for url params', (done) => {
  request(app).get('/dashboardIdentifier/widgetIdentifier').then(() => {
    expect(mockIdentify).toHaveBeenCalledWith('dashboardIdentifier', 'widgetIdentifier');
    done();
  });
});

test('404 if no dashboard identified', (done) => {
  mockIdentifyResolution = { dashboard: null };
  request(app).get('/dashboardIdentifier/widgetIdentifier').then((response) => {
    expect(response.status).toBe(404);
    expect(response.text).toBe('no dashboard with identifier "dashboardIdentifier"');
    done();
  });
});

test('404 if no widget identified', (done) => {
  mockIdentifyResolution = { dashboard: 'blah', widget: null };
  request(app).get('/dashboardIdentifier/widgetIdentifier').then((response) => {
    expect(response.status).toBe(404);
    expect(response.text).toBe('no widget with identifier "widgetIdentifier"');
    done();
  });
});
