const axios = require('axios').default;
const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports = {

    async getTitles(quantity) {

        let resultTitles;

        try {
            resultTitles = await axios.get(`https://lorem-faker.vercel.app/api?quantity=${quantity}`);

            return resultTitles.data || [];

        } catch (err) {
            throw new Error('There was an error while retrieving tasks titles. ' + err);
        }
    },

    async createTasks(tableName, items) {

        try {
            return dynamoDB.batchWrite({
                RequestItems: {
                    [tableName]: items
                }
            }).promise();

        } catch (err) {
            throw new Error('There was an error while saving tasks into the database. ' + err);
        }
    },

    async getTasks(tableName, filter) {

        try {

            let params = {
                TableName: tableName
            };

            if(filter){
                params.FilterExpression = `${filter.field} = :value`;
                params.ExpressionAttributeValues = { ':value': filter.value };
            }

            console.log('params',params);

            return dynamoDB.scan(params).promise();

        } catch (err) {
            throw new Error('There was an error while retrieving tasks from the database. ' + err);
        }
    },

    async updateTask(tableName, filter) {

        console.log('filter', filter);

        try {

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

        } catch (err) {
            throw new Error('There was an error while updating tasks to the database. ' + err);
        }
    }
};