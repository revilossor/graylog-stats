let target, promise, result;

let mockStatusCode = 200;
let mockError = null;
let mockBody = {
  dashboards: [{
    description: 'mockDescription',
    id: 'mockId',
    title: 'mockTitle',
    widgets:[{
      description: 'mockWidgetDescription',
      id: 'mockWidgetId',
      type: 'mockWidgetType',
      something: 'this should be removed!'
    }],
    something: 'this should be removed!'
  }]
};

const mockRequest = jest.fn().mockImplementation((opts, cb) => {
  cb(mockError, { statusCode: mockStatusCode }, mockBody);
});
const mockSettings = {
  username: 'mockUsername',
  password: 'mockPassword',
  protocol: 'mockProtocol',
  host: 'mockHost',
  port: 'mockPort'
};
let mockCachedData = null;

const mockIdentity = {
  dashboard: 'mockDashboardId',
  widget: 'mockWidgetId',
  data: {
    dashboard: 'mockDashbaordData',
    widget: {
      description: 'mockWidgetDescription',
      id: 'mockWidgetId',
      type: 'mockWidgetType',
      something: 'this should be removed!'
    }
  }
};

beforeAll(() => {
  jest.mock('request', () => mockRequest);
  jest.mock('../../src/util/settings', () => ({
    set: () => {},
    assign: () => {},
    get: key => mockSettings[key]
  }));
  jest.mock('../../src/util/cache', () => () => ({
    get: () => mockCachedData,
    set: (key, value) => value
  }));
  target = require('../../src/util/graylog');
});

describe('dashboards()', () => {
  beforeAll((done) => {
    promise = target.dashboards().then((res) => {
      result = res;
      done();
    });
  });

  test('function exists', () => {
    expect(target.dashboards).toBeDefined();
    expect(target.dashboards).toBeInstanceOf(Function);
  });

  test('returns a promise', () => {
    expect(promise).toBeInstanceOf(Promise);
  });

  test('does GET request for JSON to /api/dashboards', () => {
    expect(mockRequest).toHaveBeenCalledWith(expect.objectContaining({
      uri: expect.stringContaining('/api/dashboards'),
      method: 'GET',
      json: true
    }), expect.anything(Function));
  });

  describe('resolves', () => {
    test('with mutated data if nothing in cache', (done) => {
      expect(result).toEqual(expect.objectContaining([{
        description: 'mockDescription',
        id: 'mockId',
        title: 'mockTitle',
        widgets: expect.objectContaining([{
          title: 'mockWidgetDescription',
          id: 'mockWidgetId',
          type: 'mockWidgetType'
        }])
      }]));
      done();
    });
    test('with cached data if something in cache', (done) => {
      mockCachedData = 'someCachedData';
      target.dashboards().then((res) => {
        expect(res).toBe(mockCachedData);
        mockCachedData = null;
        done();
      });
    });
  });

  describe('uses settings', () => {
    for(let key in mockSettings) {
      test(`uses settings ${key}`, () => {
        expect(mockRequest).toHaveBeenCalledWith(expect.objectContaining({
          uri: expect.stringContaining(mockSettings[key])
        }), expect.anything(Function));
      });
    }

    test('doesnt add credentials to url if none in settings', (done) => {
      mockSettings.username = null;
      mockSettings.password = null;
      target.dashboards().then(() => {
        expect(mockRequest).toHaveBeenCalledWith(expect.objectContaining({
          uri: 'mockProtocol://mockHost:mockPort/api/dashboards'
        }), expect.anything(Function));
        mockSettings.username = 'mockUsername';
        mockSettings.password = 'mockPassword';
        done();
      });
    });

  });

  describe('errors', () => {
    test('rejects with error from request', (done) => {
      mockError = new Error('mockError!');
      target.dashboards().catch((err) => {
        expect(err).toBe(mockError);
        mockError = null;
        done();
      });
    });
    test('rejects with custom error if request status non 200', (done) => {
      mockStatusCode = 999;
      target.dashboards().catch((err) => {
        expect(err).toEqual(new Error('request to mockProtocol://mockUsername:mockPassword@mockHost:mockPort/api/dashboards is 999'));
        mockStatusCode = 200;
        done();
      });
    });
  });

});

describe('widgets()', () => {
  beforeAll((done) => {
    mockRequest.mockClear();
    mockBody = { result: 'mockWidgetValues' };
    promise = target.widgets(mockIdentity).then((res) => {
      result = res;
      done();
    });
  });

  test('function exists', () => {
    expect(target.widgets).toBeDefined();
    expect(target.dashboards).toBeInstanceOf(Function);
  });

  test('returns a promise', () => {
    expect(promise).toBeInstanceOf(Promise);
  });

  test('does GET request for json to /api/dashboards/{dashboardId}/widgets/{widgetId}/value', () => {
    expect(mockRequest).toHaveBeenCalledWith(expect.objectContaining({
      uri: expect.stringContaining(`/api/dashboards/${mockIdentity.dashboard}/widgets/${mockIdentity.widget}/value`),
      method: 'GET',
      json: true
    }), expect.anything(Function));
  });

  test('resolves with mutated pertinent data', () => {
    expect(result).toEqual(expect.objectContaining({
      title: 'mockWidgetDescription',
      id: 'mockWidgetId',
      type: 'mockWidgetType',
      values: 'mockWidgetValues'
    }));
  });

  describe('errors', () => {
    test('rejects with error from request', (done) => {
      mockError = new Error('mockError!');
      target.widgets(mockIdentity).catch((err) => {
        expect(err).toBe(mockError);
        mockError = null;
        done();
      });
    });
    test('rejects with custom error if request status non 200', (done) => {
      mockStatusCode = 999;
      target.widgets(mockIdentity).catch((err) => {
        expect(err).toEqual(new Error(`request to mockProtocol://mockUsername:mockPassword@mockHost:mockPort/api/dashboards/${mockIdentity.dashboard}/widgets/${mockIdentity.widget}/value is 999`));
        mockStatusCode = 200;
        done();
      });
    });
  });


});
