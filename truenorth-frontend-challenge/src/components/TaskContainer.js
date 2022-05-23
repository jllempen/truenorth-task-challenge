import '../css/TaskContainer.css';
import TaskItem from './TaskItem';

function TaskContainer(props) {
    const tasks = props.tasks;
    const completeTask = props.completeTask

    return (
        <div className='task-container'>
            {
                tasks.map(task => {
                    return <TaskItem key={task.taskId} task = {task} completeTask={completeTask} />
                })
            }
        </div>
    )
}
export default TaskContainer;