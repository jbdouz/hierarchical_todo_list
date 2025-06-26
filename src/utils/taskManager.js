const TaskManager = {
    // Create a new task object
    createTask(id, text) {
        // Add type checking and default value
        const taskText = typeof text === 'string' ? text.trim() : String(text || '').trim();
        
        return {
            id,
            text: taskText,
            completed: false,
            subtasks: []
        };
    },

    // Find a task by ID in nested structure
    findTaskById(id, taskList) {
        for (let task of taskList) {
            if (task.id === id) {
                return task;
            }
            if (task.subtasks) {
                const found = this.findTaskById(id, task.subtasks);
                if (found) return found;
            }
        }
        return null;
    },

    // Remove task by ID from nested structure
    removeTaskById(id, taskList) {
        for (let i = 0; i < taskList.length; i++) {
            if (taskList[i].id === id) {
                taskList.splice(i, 1);
                return true;
            }
            if (taskList[i].subtasks && this.removeTaskById(id, taskList[i].subtasks)) {
                return true;
            }
        }
        return false;
    },

    // Update completion status of parent tasks
    updateParentCompletion(tasks) {
        const updateTask = (task) => {
            if (task.subtasks && task.subtasks.length > 0) {
                // Recursively update all subtasks first
                task.subtasks.forEach(updateTask);
                
                // Update this task based on subtask completion
                task.completed = task.subtasks.every(subtask => subtask.completed);
            }
        };
        
        tasks.forEach(updateTask);
    },

    // Get statistics about tasks
    getTaskStats(tasks) {
        let total = 0;
        let completed = 0;

        const countTasks = (taskList) => {
            taskList.forEach(task => {
                total++;
                if (task.completed) completed++;
                if (task.subtasks) {
                    countTasks(task.subtasks);
                }
            });
        };

        countTasks(tasks);
        return { total, completed, remaining: total - completed };
    }
};

export default TaskManager;