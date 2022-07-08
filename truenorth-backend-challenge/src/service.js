const { v4: uuidv4 } = require('uuid');
const DataAccess = require('./data-access');
const AppException = require('./utils/AppException');

class TaskService {

    static async createTask(quantity) {

        const tableName = process.env.TASK_TABLE;
        const batchLimit = 25;
        let titles;

        try {
            titles = await DataAccess.getTitles(quantity);

        } catch (err) {
            console.log('err', err);
            new AppException(
                'ERR-002',
                'There was an error while retrieving tasks titles.'
            ).throw();
        }

        for (let i = 0; i < titles.length; i += batchLimit) {

            const titlesBatch = titles.slice(i, i + batchLimit);
            const tasksToSave = titlesBatch.map((title) => {
                return {
                    PutRequest: {
                        Item: {
                            taskId: uuidv4(),
                            title,
                            isCompleted: false
                        }
                    }
                };
            });
            console.log('tasksToSave', tasksToSave.length);

            try {
                await DataAccess.createTasks(tableName, tasksToSave);

            } catch (err) {
                console.log('err', err);
                new AppException(
                    'ERR-002',
                    'There was an error while saving tasks into the database.'
                ).throw();
            }
        }

        return titles;
    }

    static async getTasks(filter) {

        console.log('filter', filter);

        const tableName = process.env.TASK_TABLE;

        let getTasks = []

        try {
            getTasks = await DataAccess.getTasks(tableName, filter);
            console.log('getTasks', getTasks);

        } catch (err) {
            console.log('err', err);
            new AppException(
                'ERR-002',
                'There was an error while retrieving tasks from the database.'
            ).throw();
        }

        return getTasks;
    }

    static async updateTask(filter) {

        try {
            const tableName = process.env.TASK_TABLE;

            const updateTask = await DataAccess.updateTask(tableName, filter);
            console.log('updateTask', updateTask);

        } catch (err) {
            console.log('err', err);
            new AppException(
                'ERR-002',
                'There was an error while updating tasks to the database.'
            ).throw();
        }
    }
}

module.exports = TaskService;