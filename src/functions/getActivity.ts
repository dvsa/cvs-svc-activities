import { GetActivityService } from './../services/GetActivitiesService';
import { Context } from 'aws-lambda';
import { HTTPResponse } from '../utils/HTTPResponse';
import { DynamoDBService } from '../services/DynamoDBService';
import { HTTPRESPONSE } from '../assets/enums';
import {IActivity} from "../models/Activity";

export async function getActivity(event: any, context?: Context): Promise<any> {
  if (!(event && event.queryStringParameters)) {
    return new HTTPResponse(400, HTTPRESPONSE.BAD_REQUEST);
  }
  console.log('in function')
  const activityService = new GetActivityService(new DynamoDBService());
  const { fromStartTime, toStartTime, activityType, testStationPNumber, testerStaffId } =
    event.queryStringParameters && event.queryStringParameters;
  try {
    const data: IActivity[] = await activityService.getActivities({
      fromStartTime,
      toStartTime,
      activityType,
      testStationPNumber,
      testerStaffId
    });
    if (data === null){
      return new HTTPResponse(400, HTTPRESPONSE.BAD_REQUEST);
    }
   return data.length === 0 ? new HTTPResponse(204, HTTPRESPONSE.NO_RESOURCES) : new HTTPResponse(200, data);
  } catch (error) {
    return error as HTTPResponse;
  }
}
