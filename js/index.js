import { Task } from "./class/Task.js";
import { Todos } from "./class/Todos.js";

const taskInput = document.getElementById('taskInput');
const taskList = document.querySelector('.list-group');
const form = document.querySelector('form');

const BACKEND_ROOT_URL = 'http://localhost:3001';
const todos = new Todos(BACKEND_ROOT_URL);

const getTasks = async () => {
    try {
        const tasks = await todos.getTasks();
        tasks.forEach(task => {
            renderTask(task);
        });
        taskInput.disabled = false;
    } catch (error) {
        alert("Error retrieving tasks: " + error.message);
    }
}

const saveTask = async (task) => {
    try {
        await todos.addTask(task);
    } catch (error) {
        console.error(error);
        alert("Error saving task: " + error.message);
    }
}

// Function to render a task with a delete icon
const renderTask = (task) => {
    const li = document.createElement('li');
    li.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-center');
    
    // Task text
    const span = document.createElement('span');
    span.textContent = task.getText();
    
    // Delete icon
    const deleteIcon = document.createElement('i');
    deleteIcon.className = 'bi bi-trash';
    deleteIcon.style.cursor = 'pointer'; // Add pointer cursor for better UX
    
    // Add click event listener to delete icon
    deleteIcon.addEventListener('click', () => {
        // Call removeTask method and pass task id
        todos.removeTask(task.getId())
            .then(deletedId => {
                // Remove the task from UI
                li.remove();
            })
            .catch(error => {
                console.error('Error deleting task:', error);
                alert('Error deleting task');
            });
    });
    
    // Append elements to the list item
    li.appendChild(span);
    li.appendChild(deleteIcon);
    
    taskList.appendChild(li);
}


form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        try {
            await saveTask(taskText);
            renderTask(new Task(taskText)); // Render the task
            taskInput.value = '';
            taskInput.focus();
        } catch (error) {
            console.error(error);
        }
    }
});

getTasks();
