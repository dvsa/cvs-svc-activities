import { GetActivityService } from './../services/GetActivitiesService';
import { Context, Handler } from 'aws-lambda';
import { HTTPResponse } from '../utils/HTTPResponse';
import { DynamoDBService } from '../services/DynamoDBService';
import { HTTPRESPONSE } from '../assets/enums';

const getActivitiesForCleanup: Handler = async (
  event: any,
  context?: Context
): Promise<HTTPResponse> => {
  if (!(event && event.queryStringParameters)) {
    return new HTTPResponse(400, HTTPRESPONSE.BAD_REQUEST);
  }

  const activityService = new GetActivityService(new DynamoDBService());
  try {
    const { fromStartTime, toStartTime, activityType } = event.queryStringParameters;
    const data = await activityService.getActivities({
      fromStartTime,
      toStartTime,
      activityType
    });
    if (data === null) {
      return new HTTPResponse(400, HTTPRESPONSE.BAD_REQUEST);
    }
    return data.length === 0
      ? new HTTPResponse(204, HTTPRESPONSE.NO_RESOURCES)
      : new HTTPResponse(200, data);
  } catch (error) {
    console.error(error);
    return error as HTTPResponse;
  }
};

export { getActivitiesForCleanup };
