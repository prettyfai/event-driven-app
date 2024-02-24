import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');

  useEffect(() => {
    console.log('Fetching tasks from API...');
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    fetch('http://localhost:3000/to-do-list')
      .then(response => {
        console.log('API Response:', response);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then(data => {
        console.log('API Data:', data);
        setTasks(data.data);
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  const handleInputChange = (event) => {
    setTaskInput(event.target.value);
  };

  // Add task to the list
  const handleAddTask = () => {
    if (!taskInput.trim()) return;
    fetch('http://localhost:3000/to-do-list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: taskInput }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add task');
        }
        return response.json();
      })
      .then(() => {
        fetchTasks();
        setTaskInput('');
      })
      .catch(error => console.error('Error adding task:', error));
  };

  function onClick(id) {
    const taskExists = tasks.some(task => task.id === id);
  
    if (taskExists) {
      handleDeleteTask(id);
    } else {
      console.error(`Task with id ${id} does not exist.`);
    }
  }

  // Delete a task by its id
  const handleDeleteTask = async (idToDelete) => {
    try {
      // Make a DELETE request to the API endpoint
      await axios.delete(`http://localhost:3000/to-do-list/${idToDelete}`);
      
      // Remove the deleted task from the tasks state
      setTasks(tasks.filter(task => task.id !== idToDelete));
      
      console.log(`Task with id ${idToDelete} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Added edit function of the task list item with button edit beside the delete button
  // edit a task by its id with prompt modal

  // const handleEditTask = async (idToEdit) => {
  //   try {
  //     // Make a PUT request to the API endpoint
  //     await axios.put(`http://localhost:3000/to-do-list/${idToEdit}`);
      
  //     // Remove the edited task from the tasks state
  //     setTasks(tasks.filter(task => task.id !== idToEdit));
      
  //     console.log(`Task with id ${idToEdit} edited successfully.`);
  //   } catch (error) {
  //     console.error('Error editing task:', error);
  //   }
  // };

  const handleEditTask = async (idToEdit) => {
    try {
      // Find the task with the given ID
      const taskToEdit = tasks.find(task => task.id === idToEdit);

      // Prompt the user for the new task name, with the current name as the default value
      const newTaskName = prompt('Edit task:', taskToEdit.name);

      // Naay bug dire, so if the user cancelled the prompt, don't proceed with the edit
      if (newTaskName === null) {
        return;
      }

      // Make a PUT request to the API endpoint
      await axios.put(`http://localhost:3000/to-do-list/${idToEdit}`, { name: newTaskName });

      // Update the task in the tasks state
      setTasks(tasks.map(task => task.id === idToEdit ? { ...task, name: newTaskName } : task));

      console.log(`Task with id ${idToEdit} edited successfully.`);
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          className="task-input"
          placeholder="Enter new task..."
          value={taskInput}
          onChange={handleInputChange}
        />
        <button className="add-button" onClick={handleAddTask}>
          Add Task
        </button>
        {/* <div class="tasks-lists-container">
          <div class="task-names">Task</div>
           <div class="task-actions">Action</div>
        </div> */}
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.name}
            <div class="tasks-lists-container">
            <button className="edit-button" onClick={() => handleEditTask(task.id)}>Edit</button>
            <button className="delete-button" onClick={() => handleDeleteTask(task.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
  
};

export default App;