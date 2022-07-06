import React, { useEffect, useState } from 'react';
import NewTaskForm from './components/NewTaskForm';
import TaskContainer from './components/TaskContainer';
const axios = require('axios').default;

function App() {

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getTasks();
  },[]);

  const getTasks = async () => {    
    try{
      
      const resAPI = await axios.get('https://k4b3cwn6xk.execute-api.us-east-1.amazonaws.com/DEV/tasks/get',{
        headers:{
          'x-api-key': 'bAa5TZ4JrZ5r7CWaBso5v94eAuz4phZU56rqEt0f'
        }
      });

      console.log('resAPI', resAPI);
      
      const payload = resAPI.data.payload.payload

      setTasks(payload.Items);

    }catch(err){
      console.log('err', err);
    }
  }

  const createTasks = async quantity => {
    try{
      
      const resAPI = await axios.get(`https://k4b3cwn6xk.execute-api.us-east-1.amazonaws.com/DEV/tasks/create?quantity=${quantity}`,{
          headers:{
            'x-api-key': 'bAa5TZ4JrZ5r7CWaBso5v94eAuz4phZU56rqEt0f'
          }
        });

      console.log(resAPI);
      
      await getTasks();

    }catch(err){
      console.log('err', err);
    }

  }

  const completeTask = async task => {    
    try{
      
      if(task){

        const request = {
          payload: {
            taskId: task.taskId,
            field: "isCompleted",
            value: true
          }
        }

        const resAPI = await axios.put('https://k4b3cwn6xk.execute-api.us-east-1.amazonaws.com/DEV/tasks/update', request, {
          headers:{
            'x-api-key': 'bAa5TZ4JrZ5r7CWaBso5v94eAuz4phZU56rqEt0f'
          }
        });

        console.log('resAPI Update',resAPI);
        
        await getTasks();
      }

    }catch(err){
      console.log('err', err);
    }
  }

  return (
    <div className='container'>

      <NewTaskForm createTasks={createTasks}/>
      <TaskContainer tasks={tasks} completeTask={completeTask}/>

    </div>
  );
}

export default App;
