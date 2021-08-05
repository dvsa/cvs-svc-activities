import { GetActivityService } from './../services/GetActivitiesService';
import { Context, Handler } from 'aws-lambda';
import { HTTPResponse } from '../utils/HTTPResponse';
import { DynamoDBService } from '../services/DynamoDBService';
import { HTTPRESPONSE } from '../assets/enums';

const getActivitiesForCleanup: Handler = async (event: any, context?: Context): Promise<HTTPResponse> => {
    if (!(event && event.queryStringParameters)) {
        return new HTTPResponse(400, HTTPRESPONSE.BAD_REQUEST);
    }

    const activityService = new GetActivityService(new DynamoDBService());
    try {
        const data = await activityService.getActivities(event.queryStringParameters);
        return new HTTPResponse(200, data);
    } catch (error) {
        console.error(error);
        return new HTTPResponse(error.statusCode, error.message);
    }
};

export { getActivitiesForCleanup };
