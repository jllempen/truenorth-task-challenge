const { v4: uuidv4 } = require('uuid');
const dataAccess = require('./data-access');

module.exports = {

    async createTask(quantity) {

        const batchLimit = 25;
        let titles;

        titles = await dataAccess.getTitles(quantity);

        if (titles.length == 0) {
            throw new Error('Quantity must be grater than zero.');
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
            })

            console.log('tasksToSave', tasksToSave.length);

            const tableName = process.env.TASK_TABLE;
            await dataAccess.createTasks(tableName, tasksToSave);
        }

        return titles;
    },

    async getTasks(filter) {

        const tableName = process.env.TASK_TABLE;

        console.log('filter', filter)

        let getTasks = await dataAccess.getTasks(tableName, filter);
        console.log('getTasks', getTasks);

        return getTasks;
    },

    async updateTask(filter) {

        const tableName = process.env.TASK_TABLE;

        const updateTask = await dataAccess.updateTask(tableName, filter);
        console.log('updateTask', updateTask);
    }
};