const taskService = require('./service');
const AppException = require('./utils/AppException');

module.exports = {

    async createTask(event) {

        const quantity = event.quantity || 3;
        let titles;

        try {
            titles = await taskService.createTask(quantity);

            return {
                statusCode: 200,
                payload: {
                    itemsSaved: titles,
                    itesCount: titles.length
                },
            };


        } catch (err) {
            console.log('error', err.message);
            return {
                statusCode: 500,
                payload: {
                    message: err.message
                },
            };
        }
    },

    async getTasks() {

        try {

            const getTasks = await taskService.getTasks();

            return {
                statusCode: 200,
                payload: getTasks
            };

        } catch (err) {
            console.log('error', err.message);
            return {
                statusCode: 500,
                payload: {
                    message: err.message
                }
            };
        }
    },

    async updateTask(event) {

        let filter = event;

        const getTask = await taskService.getTasks({ field: 'taskId', value: filter.taskId });
        console.log(getTask);

        if (getTask.Items && getTask.Items.length > 0) {

            const updateTask = await taskService.updateTask(filter);
            console.log('updateTask', updateTask);

            return {
                statusCode: 200,
                payload: {
                    taskUpdated: filter.taskId
                },
            };

        } else {
            new AppException(
                'ERR-002',
                'Submitted taskId does not exist.'
            ).throw();
        }
    }
};