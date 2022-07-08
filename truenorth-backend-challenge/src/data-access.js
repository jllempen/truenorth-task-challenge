const axios = require('axios').default;
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const AppException = require('./utils/AppException');


class TaskDB {

    static async getTitles(quantity) {

        let resultTitles;
        resultTitles = await axios.get(`https://lorem-faker.vercel.app/api?quantity=${quantity}`);

        return resultTitles ? resultTitles.data : [];
    }

    static async createTasks(tableName, items) {

        return dynamoDB.batchWrite({
            RequestItems: {
                [tableName]: items
            }
        }).promise();
    }

    static async getTasks(tableName, filter) {

        let params = {
            TableName: tableName
        };

        if (filter) {
            params.FilterExpression = `${filter.field} = :value`;
            params.ExpressionAttributeValues = { ':value': filter.value };
        }

        console.log('params', params);

        return dynamoDB.scan(params).promise();
    }

    static async updateTask(tableName, filter) {

        console.log('filter', filter);
        let params = {
            TableName: tableName,
            Key: { taskId: filter.taskId },
            UpdateExpression: `set ${filter.field} = :value`,
            ExpressionAttributeValues: {
                ':value': filter.value
            }
        };

        console.log(params);

        return dynamoDB.update(params).promise();
    }
}

module.exports = TaskDB;