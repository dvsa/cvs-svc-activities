import { GetActivityService } from '../../src/services/GetActivitiesService';
import { DynamoDBMockService } from '../models/DynamoDBMockService';
import { HTTPResponse } from '../../src/utils/HTTPResponse';
import * as jsonData from '../resources/activities.json';
import { IActivity } from '../../src/models/Activity';

describe('getActivities', () => {
  const dbMock = new DynamoDBMockService();
  // @ts-ignore
  const getActivityService: GetActivityService = new GetActivityService(dbMock);
  beforeEach(() => {
    jest.resetAllMocks();
    dbMock.seed([]);
  });
  context('when no data is returned from database', () => {
    it('should throw error', () => {
      const params = {
        fromStartTime: '2020-02-12',
        toStartTime: '2020-02-12',
        activityType: 'visit'
      };
      return getActivityService.getActivities(params).catch((error: HTTPResponse) => {
        expect.assertions(1);
        expect(error.statusCode).toEqual(204);
      });
    });
  });
  context('when the parameters are valid', () => {
    it('should return array of activities', async () => {
      dbMock.seed(Array.of(jsonData[0]) as IActivity[]);
      const params = {
        fromStartTime: '2018-02-13T04:00:40.561Z',
        toStartTime: '2018-02-13T04:00:40.561Z',
        activityType: 'visit'
      };
      expect(await getActivityService.getActivities(params)).not.toHaveLength(0);
    });
  });
});
