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
  // const fetchTasks = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:3000/to-do-list');
  //     console.log(response.data);
  //     // setTasks(response.data);
  //     setTasks(response.data.tasks)
  //   } catch (error) {
  //     console.error('Error fetching tasks:', error);
  //   }
  // };

  const handleInputChange = (event) => {
    setTaskInput(event.target.value);
  };

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
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.name}
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
  
};

export default App;