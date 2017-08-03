const express = require('express'),
  request = require('supertest');

let mockIdentifyResolution = {
  dashboard: 'mockDashboardId',
  widget: 'mockWidgetId',
  data: {
    dashboard: {
      widgets: [
        { id: 'mockWidgetId_1' },
        { id: 'mockWidgetId_2' }
      ]
    }
  }
};
let mockIdentifyError = new Error('mockIdentifyError');
let mockIdentifyRejects = false;

const mockIdentify = jest.fn().mockImplementation(() => new Promise((resolve, reject) => {
  mockIdentifyRejects ? reject(mockIdentifyError) : resolve(mockIdentifyResolution);
}));

let mockWidgetsRejects = false;
const mockWidgetsError = new Error('mockWidgetsError');
let mockWidgetsResolution = { id: 'mockWidgetsResolution' };
const mockWidgets = jest.fn().mockImplementation(() => new Promise((resolve, reject) => {
  (mockWidgetsRejects) ? reject(mockWidgetsError) : resolve(mockWidgetsResolution);
}));

let target, app;

beforeAll(() => {
  jest.mock('../../src/util/identify', () => mockIdentify);
  jest.mock('../../src/util/graylog', () => ({ widgets: mockWidgets }));
  target = require('../../src/route/widget');
  app = express();
  app.use('/', target);
});

beforeEach(() => {
  mockIdentify.mockClear();
  mockWidgets.mockClear();
});

describe('/dashboardId', () => {

  test('requests identity for url params', (done) => {
    request(app).get('/dashboardIdentifier').then(() => {
      expect(mockIdentify).toHaveBeenCalledWith('dashboardIdentifier');
      done();
    });
  });

  test('calls graylog::widgets with identity for each widget in dashboard', (done) => {
    request(app).get('/dashboardIdentifier').then(() => {
      expect(mockWidgets).toHaveBeenCalledWith(expect.objectContaining({ widget: 'mockWidgetId_1' }));
      expect(mockWidgets).toHaveBeenCalledWith(expect.objectContaining({ widget: 'mockWidgetId_2' }));
      done();
    });
  });

  test('response is array of responses from graylog::widgets', (done) => {
    request(app).get('/dashboardIdentifier').then((response) => {
      var expected = [
        { id: 'mockWidgetsResolution' },
        { id: 'mockWidgetsResolution' }
      ];
      expect(response.text).toEqual(JSON.stringify(expected));
      done();
    });
  });

  test('500 if graylog::widgets rejects', (done) => {
    mockWidgetsRejects = true;
    request(app).get('/dashboardIdentifier').then((response) => {
      expect(response.status).toBe(500);
      expect(response.text).toBe('mockWidgetsError');
      mockWidgetsRejects = false;
      done();
    });
  });

  test('404 if no dashboard identified', (done) => {
    const tempMockIdentifyResolution = mockIdentifyResolution;
    mockIdentifyResolution = { dashboard: null };
    request(app).get('/dashboardIdentifier').then((response) => {
      expect(response.status).toBe(404);
      expect(response.text).toBe('no dashboard with identifier "dashboardIdentifier"');
      mockIdentifyResolution = tempMockIdentifyResolution;
      done();
    });
  });

});

describe('/dashboardId/widgetId', () => {

  test('requests identity for url params', (done) => {
    request(app).get('/dashboardIdentifier/widgetIdentifier').then(() => {
      expect(mockIdentify).toHaveBeenCalledWith('dashboardIdentifier', 'widgetIdentifier');
      done();
    });
  });

  test('calls graylog::widgets with identity', (done) => {
    request(app).get('/dashboardIdentifier/widgetIdentifier').then(() => {
      expect(mockWidgets).toHaveBeenCalledWith(mockIdentifyResolution);
      done();
    });
  });

  test('response is response form graylog::widgets', (done) => {
    request(app).get('/dashboardIdentifier/widgetIdentifier').then((response) => {
      expect(response.text).toEqual(JSON.stringify({ id: 'mockWidgetsResolution' }));
      done();
    });
  });

  test('500 if graylog::widgets rejects', (done) => {
    mockWidgetsRejects = true;
    request(app).get('/dashboardIdentifier/widgetIdentifier').then((response) => {
      expect(response.status).toBe(500);
      expect(response.text).toBe('mockWidgetsError');
      mockWidgetsRejects = false;
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

});
