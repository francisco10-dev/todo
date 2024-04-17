import React, {useEffect, useState} from 'react'

export const EditTodoForm = ({editTodo, task, loading}) => {
    const [value, setValue] = useState(task.title);

    const handleSubmit = (e) => {
      // prevent default action
        e.preventDefault();
        // edit todo
        const data = {
          title: value
        }
        editTodo(data, task.id);
    };

    return (
      <form onSubmit={handleSubmit} className="TodoForm">
      <input type="text" value={value} onChange={(e) => setValue(e.target.value)} className="todo-input" placeholder='Update task' />
      <button type="submit" className='todo-btn'>{ loading ? 'Actualizando' : 'Actualizar tarea'}</button>
    </form>
  )
}
