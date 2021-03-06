/* tslint:disable */
import {ActivityType} from "../assets/enums";

const AWSXRay = require("aws-xray-sdk");
const AWS = AWSXRay.captureAWS(require("aws-sdk"));
/* tslint:enable */
import {AWSError} from "aws-sdk"; // Only used as a type, so not wrapped by XRay
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client"; // Only used as a type, so not wrapped by XRay
import {PromiseResult} from "aws-sdk/lib/request"; // Only used as a type, so not wrapped by XRay
import {Configuration} from "../utils/Configuration";

export class DynamoDBService {
    private static client: DocumentClient;
    private readonly tableName: string;

    /**
     * Constructor for the DynamoDBService
     */
    public constructor() {
        const config: any = Configuration.getInstance().getDynamoDBConfig();
        this.tableName = config.table;

        if (!DynamoDBService.client) {
            DynamoDBService.client = new AWS.DynamoDB.DocumentClient(config.params);
        }
    }

    /**
     * Scan the entire table and retrieve all data
     * @returns Promise<PromiseResult<DocumentClient.ScanOutput, AWSError>>
     */
    public scan(): Promise<PromiseResult<DocumentClient.ScanOutput, AWSError>> {
        return DynamoDBService.client.scan({ TableName: this.tableName })
            .promise();
    }

    /**
     * Retrieves the item with the given key
     * @param key - the key of the item you wish to fetch
     * @param attributes - optionally, you can request only a set of attributes
     * @returns Promise<PromiseResult<DocumentClient.GetItemOutput, AWSError>>
     */
    public get(key: DocumentClient.Key, attributes?: DocumentClient.AttributeNameList): Promise<PromiseResult<DocumentClient.GetItemOutput, AWSError>> {
        const query: DocumentClient.GetItemInput = {
            TableName: this.tableName,
            Key: key,
        };

        if (attributes) {
            Object.assign(query, { AttributesToGet: attributes });
        }

        return DynamoDBService.client.get(query)
            .promise();
    }

    /**
     * Retrieves the ongoing activity for a given staffId
     * @param staffId - staff id for which to retrieve activity
     * @returns Promise<PromiseResult<DocumentClient.QueryOutput, AWSError>>
     */
    public getOngoingByStaffId(staffId: string): Promise<PromiseResult<DocumentClient.QueryOutput, AWSError>> {
        const query: DocumentClient.QueryInput = {
            TableName: this.tableName,
            IndexName: "StaffIndex",
            KeyConditionExpression: "testerStaffId = :staffId",
            FilterExpression: "attribute_type(endTime, :NULL)",
            ExpressionAttributeValues: {
                ":staffId": staffId,
                ":NULL": "NULL"
            }
        };

        return DynamoDBService.client.query(query)
            .promise();
    }

    /**
     * Retrieves the activity of type visit where startTime is greater or equal than the query param fromStartTime
     * @param staffId - query param start time for which to retrieve activity
     * @returns Promise<PromiseResult<DocumentClient.QueryOutput, AWSError>>
     */
    public getActivitiesWhereStartTimeGreaterThan(activityDay: string, startTime: string): Promise<PromiseResult<DocumentClient.QueryOutput, AWSError>> {
        const query: DocumentClient.QueryInput = {
            TableName: this.tableName,
            IndexName: "ActivityDayIndex",
            KeyConditionExpression: "activityDay = :activityDay AND startTime >= :startTime",
            ExpressionAttributeValues: {
                ":startTime": startTime,
                ":activityDay": activityDay
            }
        };

        return DynamoDBService.client.query(query).promise();
    }

    /**
     * Replaces the provided item, or inserts it if it does not exist
     * @param item - item to be inserted or updated
     * @returns Promise<PromiseResult<DocumentClient.PutItemOutput, AWSError>>
     */
    public put(item: any): Promise<PromiseResult<DocumentClient.PutItemOutput, AWSError>> {
        const query: DocumentClient.PutItemInput = {
            TableName: this.tableName,
            Item: item,
            ReturnValues: "ALL_OLD"
        };

        return DynamoDBService.client.put(query)
            .promise();
    }

    /**
     * Deletes the item with the given key and returns the item deleted
     * @param key - the key of the item you wish to delete
     * @returns Promise<PromiseResult<DocumentClient.DeleteItemOutput, AWSError>>
     */
    public delete(key: DocumentClient.Key): Promise<PromiseResult<DocumentClient.DeleteItemOutput, AWSError>> {
        const query: DocumentClient.DeleteItemInput = {
            TableName: this.tableName,
            Key: key,
            ReturnValues: "ALL_OLD",
        };

        return DynamoDBService.client.delete(query)
            .promise();
    }

    /**
     * Retrieves a list of batches containing results for the given keys
     * @param keys - a list of keys you wish to retrieve
     * @returns Promise<PromiseResult<BatchGetItemOutput, AWSError>>
     */
    public batchGet(keys: DocumentClient.KeyList): Promise<PromiseResult<DocumentClient.BatchGetItemOutput, AWSError>[]> {
        const keyList: DocumentClient.KeyList = keys.slice();
        const keyBatches: DocumentClient.KeyList[] = [];

        while (keyList.length > 0) {
            keyBatches.push(keyList.splice(0, 100));
        }

        const promiseBatch: Promise<PromiseResult<DocumentClient.BatchGetItemOutput, AWSError>>[] = keyBatches.map((batch: DocumentClient.KeyList) => {
            const query: DocumentClient.BatchGetItemInput = {
                RequestItems: {
                    [this.tableName]: {
                        Keys: batch,
                    },
                },
            };

            return DynamoDBService.client.batchGet(query)
            .promise();
        });

        return Promise.all(promiseBatch);
    }

    /**
     * Updates or creates the items provided, and returns a list of result batches
     * @param items - items to add or update
     * @returns Promise<PromiseResult<DocumentClient.BatchWriteItemOutput, AWSError>[]>
     */
    public batchPut(items: any[]): Promise<PromiseResult<DocumentClient.BatchWriteItemOutput, AWSError>[]> {
        const itemList: DocumentClient.WriteRequests = items.slice();
        const itemBatches: DocumentClient.WriteRequests[] = [];

        while (itemList.length > 0) {
            itemBatches.push(itemList.splice(0, 25));
        }

        const promiseBatch: Promise<PromiseResult<DocumentClient.BatchWriteItemOutput, AWSError>>[] = itemBatches.map((batch: any[]) => {
            const query: DocumentClient.BatchWriteItemInput = {
                RequestItems: {
                    [this.tableName]: batch.map((item: any) => ({ PutRequest: { Item: item } })),
                },
            };

            return DynamoDBService.client.batchWrite(query)
            .promise();
        });

        return Promise.all(promiseBatch);
    }
}
