import { GetActivityService } from "./../services/GetActivitiesService";
import { Context, Handler } from "aws-lambda";
import { HTTPResponse } from "../utils/HTTPResponse";
import {DynamoDBService} from "../services/DynamoDBService";
import { HTTPRESPONSE } from "../assets/enums";


const getActivity: Handler = async (event: any, context?: Context): Promise<any> => {
    if (!(event && event.queryStringParameters)) {
        return new HTTPResponse(400, HTTPRESPONSE.BAD_REQUEST);
    }

    const activityService = new GetActivityService(new DynamoDBService());
    return activityService.getActivities(event.queryStringParameters)
        .then((data: any) => {
            return new HTTPResponse(200, data);
        })
        .catch((error: HTTPResponse) => {
            return error;
        });
};

export { getActivity };
