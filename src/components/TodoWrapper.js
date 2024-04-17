import React, { useCallback, useEffect, useState } from "react";
import { Todo } from "./Todo";
import { TodoForm } from "./TodoForm";
import { EditTodoForm } from "./EditTodoForm";
import axios from "axios";
import { message } from "antd";

const apiUrl = "https://apitask-g8ne.onrender.com/"; 

export const TodoWrapper = () => {
  const [loadingData, setLoadingData] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState();
  const [completedTasks, setCompletedTasks] = useState(0);

  const loadData = async () => {
    try {
      setLoadingData(true);
      const response = await axios.get(apiUrl + 'tasks');
      setData(response.data);
    } catch (error) {
      console.log(error);
    }finally{
      setLoadingData(false);
    }
  }

  const updateTask = async (data, id) => {
    try {
      setIsUpdating(true);
      const response = await axios.put(apiUrl + 'update-tasks/' + id, data);
      setSelected(null);
      loadData();
      console.log(response);
    } catch (error) {
      console.log(error);
    }finally{
      setIsUpdating(false);
    }
  }

  const deleteTask = async (id) => {
    try {
      message.loading('Eliminando tarea...');
      const response = await axios.delete(apiUrl + 'delete-tasks/' + id);
      console.log(response);
      loadData();
    } catch (error) {
      console.log(error);
    }finally{
      message.destroy();
    }
  }

  const addTask = async (value) => {
    try {
      setIsAdding(true);
      const data = {
        title: value
      }
      const response = await axios.post(apiUrl + 'add-tasks', data);
      console.log(response);
      loadData();
    } catch (error) {
      console.log(error);
    }finally{
      setIsAdding(false);
    }
  }


  useEffect(()=> {
    loadData();
  },[]);

  const completedCount = useCallback(() => {
    const completedTasks = data.filter(task => task.status === 'completed');
    setCompletedTasks(completedTasks.length);
  }, [data, setCompletedTasks]);
  
  useEffect(() => {
    completedCount(); 
  }, [completedCount]);  
  

  const toggleComplete = (task) => {
    const status = task.status === 'pending' ? 'completed' : 'pending';
    const data = {
      title: task.title,
      status: status
    }
    console.log(status);
    updateTask(data, task.id);
  }

  const editTodo = (id) => {
    setSelected(id);
  }

  return (
    <div>
    <div className="TodoWrapper">
      <div>
        <h1>TO DO</h1>
        <TodoForm addTodo={addTask} loading={isAdding} />        
      </div>
      { data.length > 0 ?
        <div className="data">
          {data.map((todo) =>
            selected === todo.id ? (
              <EditTodoForm editTodo={updateTask} task={todo} loading={isUpdating} />
            ) : (
              <Todo
                key={todo.id}
                task={todo}
                deleteTodo={deleteTask}
                editTodo={editTodo}
                toggleComplete={toggleComplete}
              />
            )
          )}        
        </div> : !loadingData ?
        <div className="flag">
          <span class="text">No hay tareas por hacer</span>
        </div> : null
      }
    </div>
    {data.length > 0 && (
      <div class="flag2">
          <span className="text">Tienes {completedTasks} {completedTasks !== 1 ? 'tareas completadas' : ' tarea completada'} </span>
      </div>      
    )}
  </div>
  );
};




