<script>
import TodoItem from './components/TodoItem.vue'
import TaskInput from './components/TaskInput.vue'
import TaskManager from './utils/taskManager.js'

export default {
  name: 'App',
  components: {
    TodoItem,
    TaskInput
  },
  data() {
    return {
      tasks: [],
      nextId: 1
    }
  },
  computed: {
    taskStats() {
      return TaskManager.getTaskStats(this.tasks);
    },
    hasActiveTasks() {
      return this.tasks.length > 0
    }
  },
  methods: {
    addMainTask(text) {
      const newTask = TaskManager.createTask(this.nextId++, text);
      this.tasks.push(newTask);
      console.log("new task added")
    },

    toggleTask(id) {
      const task = TaskManager.findTaskById(id, this.tasks);
      if (task) {
        task.completed = !task.completed;
        TaskManager.updateParentCompletion(this.tasks);
      }
    },

    deleteTask(id) {
      TaskManager.removeTaskById(id, this.tasks);
      TaskManager.updateParentCompletion(this.tasks);
    },

    addSubtask(parentId, text) {
      const parentTask = TaskManager.findTaskById(parentId, this.tasks);
      if (parentTask) {
        const newSubtask = TaskManager.createTask(this.nextId++, text);
        if (!parentTask.subtasks) {
          parentTask.subtasks = [];
        }
        parentTask.subtasks.push(newSubtask);
        TaskManager.updateParentCompletion(this.tasks);
      }
    },

    clearCompleted() {
      const removeCompleted = (taskList) => {
        return taskList.filter(task => {
          if (task.subtasks) {
            task.subtasks = removeCompleted(task.subtasks);
          }
          return !task.completed;
        });
      };
      this.tasks = removeCompleted(this.tasks);
    }
  }
}
</script>

<template>
  <div class="app">
    <div class="container">
      <header class="header">
        <div class="header__content">
          <h1 class="header__title">
            <span class="header__icon">📋</span>
            Todo Hierarchy
          </h1>
          <p class="header__subtitle">Organize your tasks with nested subtasks</p>
        </div>
      </header>

      <main class="main">
        <div class="main__card">
          <task-input @add-task="addMainTask" />

          <div v-if="hasActiveTasks" class="stats-section">
            <div class="stats">
              <div class="stats__item stats__item--total">
                <span class="stats__number">{{ taskStats.total }}</span>
                <span class="stats__label">Total</span>
              </div>
              <div class="stats__item stats__item--completed">
                <span class="stats__number">{{ taskStats.completed }}</span>
                <span class="stats__label">Done</span>
              </div>
              <div class="stats__item stats__item--remaining">
                <span class="stats__number">{{ taskStats.remaining }}</span>
                <span class="stats__label">Left</span>
              </div>
            </div>
            <button 
              v-if="taskStats.completed > 0" 
              @click="clearCompleted" 
              class="clear-btn"
            >
              <span>🗑️</span>
              Clear Completed
            </button>
          </div>

          <div class="task-list">
            <todo-item 
              v-for="task in tasks" 
              :key="task.id" 
              :task="task" 
              @toggle-task="toggleTask" 
              @delete-task="deleteTask"
              @add-subtask="addSubtask" 
            />
          </div>

          <div v-if="!hasActiveTasks" class="empty-state">
            <div class="empty-state__icon">✨</div>
            <h3 class="empty-state__title">Ready to get productive?</h3>
            <p class="empty-state__text">Add your first task above to get started</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* Reset and base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  font-weight: 400;
  line-height: 1.6;
  color: #1e293b;
  background: linear-gradient(135deg, #065f46 0%, #047857 25%, #059669 50%, #10b981 75%, #34d399 100%);
  min-height: 100vh;
  letter-spacing: -0.01em;
}

.app {
  min-height: 100vh;
  padding: 1rem;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

/* Header */
.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header__content {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.header__title {
  font-size: clamp(2.2rem, 5vw, 3.2rem);
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  letter-spacing: -0.02em;
}

.header__icon {
  font-size: 0.8em;
}

.header__subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: clamp(1rem, 3vw, 1.2rem);
  font-weight: 300;
  letter-spacing: -0.01em;
}

/* Main content */
.main {
  margin-bottom: 2rem;
}

.main__card {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 28px;
  padding: clamp(2rem, 4vw, 3.5rem);
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
}

/* Stats section */
.stats-section {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  margin: 2.5rem 0;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.08) 100%);
  border-radius: 20px;
  border: 1px solid rgba(16, 185, 129, 0.1);
}

.stats {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.stats__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.25rem 1.75rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  min-width: 90px;
  border: 1px solid rgba(16, 185, 129, 0.1);
  transition: all 0.2s ease;
}

.stats__item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.stats__item--total {
  border-left: 4px solid #059669;
}

.stats__item--completed {
  border-left: 4px solid #10b981;
}

.stats__item--remaining {
  border-left: 4px solid #34d399;
}

.stats__number {
  font-size: 1.75rem;
  font-weight: 600;
  color: #064e3b;
  letter-spacing: -0.02em;
}

.stats__label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #047857;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 0.25rem;
}

.clear-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  font-family: inherit;
  letter-spacing: -0.01em;
}

.clear-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

/* Task list */
.task-list {
  margin-top: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.5rem 0;
}

.task-list:empty {
  display: none;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.empty-state__icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.8;
}

.empty-state__title {
  font-size: 1.5rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.75rem;
  letter-spacing: -0.01em;
}

.empty-state__text {
  font-size: 1rem;
  color: #6b7280;
  font-weight: 300;
  letter-spacing: -0.005em;
}

/* Global button and input styles */
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: inherit;
  letter-spacing: -0.01em;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn--success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn--success:hover {
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
}

.btn--primary {
  background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
  color: #064e3b;
  box-shadow: 0 4px 12px rgba(52, 211, 153, 0.3);
  font-weight: 600;
}

.btn--primary:hover {
  box-shadow: 0 8px 20px rgba(52, 211, 153, 0.4);
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.btn--danger {
  background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(248, 113, 113, 0.3);
}

.btn--danger:hover {
  box-shadow: 0 8px 20px rgba(248, 113, 113, 0.4);
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.btn--small {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  border-radius: 10px;
}

.btn--large {
  padding: 1.125rem 2.25rem;
  font-size: 1rem;
  border-radius: 16px;
}

.input {
  padding: 0.875rem 1.25rem;
  border: 2px solid rgba(16, 185, 129, 0.2);
  border-radius: 14px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  width: 100%;
  font-family: inherit;
  font-weight: 400;
  letter-spacing: -0.01em;
}

.input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  background: rgba(255, 255, 255, 1);
}

.input--small {
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  border-radius: 10px;
}

.input--large {
  padding: 1.125rem 1.5rem;
  font-size: 1.1rem;
  border-radius: 16px;
}

/* Responsive design */
@media (max-width: 768px) {
  .app {
    padding: 0.5rem;
  }
  
  .main__card {
    padding: 2rem;
  }
  
  .stats-section {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }
  
  .stats {
    justify-content: center;
  }
  
  .stats__item {
    min-width: 80px;
    padding: 1rem 1.25rem;
  }
  
  .header__content {
    padding: 2rem;
  }
}

@media (max-width: 480px) {
  .stats {
    flex-direction: column;
    width: 100%;
  }
  
  .stats__item {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
    min-width: unset;
  }
  
  .clear-btn {
    width: 100%;
    justify-content: center;
  }
  
  body {
    font-size: 0.9rem;
  }
}
</style>
