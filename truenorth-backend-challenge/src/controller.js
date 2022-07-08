const TaskService = require('./service');
const AppException = require('./utils/AppException');

module.exports = {

    async createTask(payload) {

        const quantity = payload.quantity || 3;

        try {
            const titles = await TaskService.createTask(quantity);

            console.log(titles);
            return titles;

        } catch (err) {
            console.log('error', err.message);
            new AppException(
                'ERR-002',
                'Error creating tasks'
            ).throw();
        }
    },

    async getTasks() {

        const getTasks = await TaskService.getTasks();
        console.log(getTasks);

        return getTasks;
    },

    async updateTask(payload) {

        let filter = payload;

        const getTask = await TaskService.getTasks({ field: 'taskId', value: filter.taskId });
        console.log(getTask);

        if (getTask.Items && getTask.Items.length > 0) {

            const updateTask = await TaskService.updateTask(filter);
            console.log('updateTask', updateTask);

            return updateTask;

        } else {
            new AppException(
                'ERR-002',
                'Submitted taskId does not exist.'
            ).throw();
        }
    }
};