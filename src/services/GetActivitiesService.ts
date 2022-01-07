import {ActivityFilters} from './../utils/Filters';
import {HTTPResponse} from '../utils/HTTPResponse';
import {DynamoDBService} from './DynamoDBService';
import {HTTPRESPONSE} from '../assets/enums';
import {IActivity, IActivityParams} from '../models/Activity';
import {isValid} from 'date-fns';

export class GetActivityService {
  public readonly dbClient: DynamoDBService;

  /**
   * Constructor for the ActivityService class
   * @param dynamo
   */
  constructor(dynamo: DynamoDBService) {
    this.dbClient = dynamo;
  }

  /**
   * Get activities from Dynamodb
   * @param event
   * @returns Promise - Array of activities filtered based on the given params and sorted desc
   */
  public async getActivities(params: IActivityParams): Promise<any> {
    try {
      console.log('in service')
      const { fromStartTime, toStartTime, activityType } = params;
      if (
        !(
          fromStartTime &&
          toStartTime &&
          activityType &&
          isValid(new Date(fromStartTime)) &&
          isValid(new Date(toStartTime))
        )
      ) {
        console.log('in 400 when start time gone')
        return null
        // return new HTTPResponse(400, HTTPRESPONSE.BAD_REQUEST);
      }
      const data: IActivity[] = await this.dbClient.getActivities(params);
      if (!(data && data.length)) {
        return data
      }
      const ActivityFilter: ActivityFilters = new ActivityFilters();
      return ActivityFilter.returnOrderedActivities(data);
    } catch (error) {
      if (error instanceof HTTPResponse) {
        console.log('error on getActivities:', error);
        throw new HTTPResponse(error.statusCode, error.body);
      }
    }
  }
}
