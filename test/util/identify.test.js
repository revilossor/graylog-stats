let target;

const mockDashboardResolution = [
  {
    title: 'mockDashboardTitle_1',
    id: 'mockDashboardId_1',
    widgets: [
      { title: 'mockDashboardWidgetTitle_1_1', id: 'mockDashboardWidgetId_1_1' },
      { title: 'mockDashboardWidgetTitle_1_2', id: 'mockDashboardWidgetId_1_2' }
    ]
  },
  {
    title: 'mockDashboardTitle_2',
    id: 'mockDashboardId_2',
    widgets: [
      { title: 'mockDashboardWidgetTitle_2_1', id: 'mockDashboardWidgetId_2_1' },
      { title: 'mockDashboardWidgetTitle_2_2', id: 'mockDashboardWidgetId_2_2' }
    ]
  }
];
const mockDashboardError = new Error('mockDashboardError');
let mockDashboardRejects = false;

const mockDashboards = jest.fn().mockImplementation(() => new Promise((resolve, reject) => {
  (mockDashboardRejects) ? reject(mockDashboardError) : resolve(mockDashboardResolution);
}));

const assertions = [
  {
    description: 'dashboard id returns the id',
    args: ['mockDashboardId_1'],
    response: {
      dashboard: 'mockDashboardId_1',
      widget: null
    }
  },
  {
    description: 'dashboard title returns the id',
    args: ['mockDashboardTitle_1'],
    response: {
      dashboard: 'mockDashboardId_1',
      widget: null
    }
  },
  {
    description: 'widget id, dashboard id returns dashboard id, widget id',
    args: ['mockDashboardId_2', 'mockDashboardWidgetId_2_1'],
    response: {
      dashboard: 'mockDashboardId_2',
      widget: 'mockDashboardWidgetId_2_1'
    }
  },
  {
    description: 'widget id, dashboard title returns dashboard id, widget id',
    args: ['mockDashboardTitle_2', 'mockDashboardWidgetId_2_2'],
    response: {
      dashboard: 'mockDashboardId_2',
      widget: 'mockDashboardWidgetId_2_2'
    }
  },
  {
    description: 'widget title, dashboard id returns dashboard id, widget id',
    args: ['mockDashboardId_2', 'mockDashboardWidgetId_2_1'],
    response: {
      dashboard: 'mockDashboardId_2',
      widget: 'mockDashboardWidgetId_2_1'
    }
  },
  {
    description: 'widget title, dashboard title returns dashboard id, widget id',
    args: ['mockDashboardTitle_1', 'mockDashboardWidgetId_1_2'],
    response: {
      dashboard: 'mockDashboardId_1',
      widget: 'mockDashboardWidgetId_1_2'
    }
  }
];

beforeAll(() => {
  jest.mock('../../src/util/graylog', () => ({ dashboards: mockDashboards }));
  target = require('../../src/util/identify');
});

beforeEach(() => {
  mockDashboards.mockClear();
});

test('exports a function', () => {
  expect(target).toBeDefined();
  expect(target).toBeInstanceOf(Function);
});

test('returns a promise', () => {
  expect(target('blah')).toBeInstanceOf(Promise);
});

test('gets dashboard data from graylog module', (done) => {
  target('blah', 'blah').then(() => {
    expect(mockDashboards).toHaveBeenCalled();
    done();
  });
});

test('reject if dashboard call rejects', (done) => {
  mockDashboardRejects = true;
  target('blah', 'blah').catch((err) => {
    expect(err).toBeInstanceOf(Error);
    expect(err).toEqual(mockDashboardError);
    mockDashboardRejects = false;
    done();
  });
});

describe('returns ids when passed id or title', () => {
  assertions.forEach((assertion) => {
    test(assertion.description, (done) => {
      target(...assertion.args).then((res) => {
        expect(res).toEqual(expect.objectContaining(assertion.response));
        done();
      });
    });
  });
});

test('returns the found dashboard data', (done) => {
  target('mockDashboardTitle_1').then((res) => {
    expect(res).toEqual(expect.objectContaining({ data: expect.objectContaining( { title: 'mockDashboardTitle_1' } ) }));
    done();
  });
});
