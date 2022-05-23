import React, { useState } from 'react';
import '../css/TaskItem.css'
import DialogBox from './DialogBox';

function TaskItem(props) {

    const [open, setOpen] = useState(false);
    const [dialogConfig, setDialogConfig] = useState({});

    const task = props.task
    const statusClass = task.isCompleted ? '' : 'false';

    const closeModalHandler = () => {
        setOpen(false);
    };

    const openDialog = (event) => {
        event.preventDefault();

        setDialogConfig({
            title: 'Complete Tasks Confirmation',
            message: `Are you sure you want to complete task: ${task.title}?`,
            actionName: 'Yes',
            action: updateTask
        })
        setOpen(true);
    };

    const updateTask = async () => {
        setOpen(false);

        await props.completeTask(task);

        setDialogConfig({
            title: 'Complete Tasks Confirmation',
            message: 'Task has successfully been marked as completed.'
        })
        setOpen(true);
    };

    return (
        <div className='task-card'>
            <div className='task-item'>
                <div style={{ height: '8rem' }}>
                    <span>{task.taskId}</span>
                    <p>{task.title}</p>
                </div>
                <div>
                    <button onClick={openDialog} className={statusClass} type='submit' disabled={task.isCompleted}>{task.isCompleted ? 'Completed' : 'Pending'}</button>
                </div>
                {
                    open ? 
                    <DialogBox open={open} close={closeModalHandler} config={dialogConfig} />
                    : ''
                }
                
            </div>
        </div>
    )
}
export default TaskItem;