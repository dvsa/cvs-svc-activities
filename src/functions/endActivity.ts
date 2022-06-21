import { APIGatewayProxyResult, Context, Handler } from 'aws-lambda';
import { ActivityService } from '../services/ActivityService';
import { HTTPResponse } from '../utils/HTTPResponse';
import { DynamoDBService } from '../services/DynamoDBService';
import { HTTPRESPONSE } from '../assets/enums';
import { Validator } from '../utils/Validator';
import {HTTPError} from "../models/HTTPError";

const endActivity: Handler = async (
  event: any,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const activityService = new ActivityService(new DynamoDBService());
  const check: Validator = new Validator();
  // auto-close will provide the endTime in the event body but VTA requests will not
  const endTime: string = event.body ? event.body.endTime : null;

  if (event.pathParameters) {
    if (!check.parametersAreValid(event.pathParameters)) {
      return new HTTPError(400, HTTPRESPONSE.MISSING_PARAMETERS);
    }
  } else {
    return new HTTPError(400, HTTPRESPONSE.MISSING_PARAMETERS);
  }
  const id: string = event.pathParameters.id;
  return activityService
    .endActivity(id, endTime)
    .then((wasVisitAlreadyClosed) => {
      return new HTTPResponse(200, wasVisitAlreadyClosed);
    })
    .catch((error: HTTPResponse) => {
      console.log(error.body);
      return error;
    });
};

export { endActivity };
