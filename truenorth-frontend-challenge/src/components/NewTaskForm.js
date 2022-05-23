import React, { useState } from 'react';
import '../css/NewTaskForm.css';
import DialogBox from './DialogBox';

const NewTaskForm = (props) => {
    const [quantity, setQuantity] = useState('');
    const [open, setOpen] = useState(false);
    const [dialogConfig, setDialogConfig] = useState({});

    const closeModalHandler = () => {
        setOpen(false);
    };
    
    const quantityChangeHandler = (event) => {
        console.log(event.target.value)
        setQuantity(event.target.value);
    };

    const submitHandler = async (event) => {
        event.preventDefault();

        if(!isNaN(quantity) && quantity > 0){
            await props.createTasks(quantity);

            setQuantity('');
        
            setDialogConfig({
                title: 'Create Tasks Confirmation',
                message: 'Tasks created successfully'
            })

        }else{
            setDialogConfig({
                title: 'Create Tasks Confirmation',
                message: 'Quantity must be grater than zero.'
            });
        }

        setOpen(true);
        
    };

    return (
        <div className='task-form'>
            <form onSubmit={submitHandler}>
                <div className='task-form__controls'>
                    <div className='task-form__control'>
                        <label>Task Quantity</label>
                        <input
                            type='text'
                            value={quantity}
                            onChange={quantityChangeHandler}
                        />
                    </div>

                </div>
                <div>
                    <button type='submit'>Create Tasks</button>
                </div>
                {
                    open?
                    <DialogBox open={open} close={closeModalHandler} config={dialogConfig}/>
                    :''
                }
            </form>
        </div>
    );
};

export default NewTaskForm;