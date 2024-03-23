import { Task } from "./Task.js";

class Todos {

    #tasks = []
    #backendurl = ''
    constructor(url) {
        this.#backendurl = url;
    }

    async getTasks() {
        try {
            const response = await fetch(this.#backendurl);
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            const data = await response.json();
            if (!data || !Array.isArray(data.result)) {
                throw new Error('Invalid data format');
            }
            const tasks = data.result.map(task => new Task(task.id, task.description));
            return tasks;
        } catch (error) {
            throw new Error("Error retrieving tasks: " + error.message);
        }
    }

    async addTask(taskDescription) {
        try {
            const response = await fetch(this.#backendurl + '/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ description: taskDescription })
            });
            if (!response.ok) {
                throw new Error('Failed to add task');
            }
            const data = await response.json();
            return new Task(data.id, taskDescription);
        } catch (error) {
            throw new Error("Error adding task: " + error.message);
        }
    }

    removeTask = (id) => {
        return new Promise(async(resolve, reject) => {
            fetch(this.#backendurl + '/delete/' + id, {
                method: 'delete'
            })
            .then((response) => response.json())
            .then((json) => {
                this.#removeFromArray(id);
                resolve(json.id);
            }, (error) => {
                reject(error);
            });
        });
    }
    #removeFromArray(id) {
        this.#tasks = this.#tasks.filter(task => task.getId() !== id);
    }


    
}

export { Todos };
