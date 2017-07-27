let target, promise, result;

let mockStatusCode = 200;
let mockError = null;
let mockBody = {
  dashboards: [{
    description: 'mockDescription',
    id: 'mockId',
    title: 'mockTitle',
    widgets:[{
      description: 'mockDescription',
      id: 'mockId',
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

beforeAll(() => {
  jest.mock('request', () => mockRequest);
  jest.mock('../../src/util/settings', () => ({
    set: () => {},
    assign: () => {},
    get: key => mockSettings[key]
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

  test('resolves with mutated data', () => {
    expect(result).toEqual(expect.objectContaining([{
      description: 'mockDescription',
      id: 'mockId',
      title: 'mockTitle',
      widgets: expect.objectContaining([{
        description: 'mockDescription',
        id: 'mockId',
      }])
    }]));
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
