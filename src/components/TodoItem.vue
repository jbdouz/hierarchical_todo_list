<script>
export default {
    name: 'TodoItem',
    props: {
        task: {
            type: Object,
            required: true
        }
    },
    emits: ['toggle-task', 'delete-task', 'add-subtask'],
    data() {
        return {
            newSubtaskText: ''
        }
    },
    methods: {
        handleToggle() {
            this.$emit('toggle-task', this.task.id);
        },
        handleDelete() {
            this.$emit('delete-task', this.task.id);
        },
        handleAddSubtask() {
            if (this.newSubtaskText.trim()) {
                this.$emit('add-subtask', this.task.id, this.newSubtaskText.trim());
                this.newSubtaskText = '';
            }
        },
        onKeyEnter() {
            this.handleAddSubtask();
        }
    },
};
</script>

<template>
    <div class="todo-item" :class="{ 'todo-item--completed': task.completed }">
        <div class="todo-item__header">
            <input 
                type="checkbox" 
                :checked="task.completed"
                @change="handleToggle"
                class="todo-item__checkbox"
            >
            <span class="todo-item__text" :class="{ 'todo-item__text--completed': task.completed }">
                {{ task.text }}
            </span>
            <button class="todo-item__delete btn btn--danger btn--compact" @click="handleDelete">
                Delete
            </button>
        </div>
        
        <div class="todo-item__add-subtask">
            <input 
                v-model="newSubtaskText"
                @keyup.enter="onKeyEnter"
                placeholder="Add a subtask..."
                class="todo-item__subtask-input input input--small"
            >
            <button @click="handleAddSubtask" class="todo-item__subtask-button btn btn--primary btn--small">
                Add Subtask
            </button>
        </div>

        <!-- Fix the recursive rendering of subtasks -->
        <div v-if="task.subtasks && task.subtasks.length > 0" class="todo-item__subtasks">
            <todo-item
                v-for="subtask in task.subtasks"
                :key="subtask.id"
                :task="subtask"
                @toggle-task="$emit('toggle-task', $event)"
                @delete-task="$emit('delete-task', $event)"
                @add-subtask="(parentId, text) => $emit('add-subtask', parentId, text)"
            />
        </div>
    </div>
</template>

<style scoped>
.todo-item {
    background: white;
    border: 1px solid rgba(16, 185, 129, 0.1);
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    transition: all 0.2s ease;
}

.todo-item:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: rgba(16, 185, 129, 0.2);
}

.todo-item--completed {
    opacity: 0.7;
    background: rgba(16, 185, 129, 0.02);
}

.todo-item__header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
}

.todo-item__checkbox {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 6px;
    border: 2px solid #d1d5db;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
}

.todo-item__checkbox:checked {
    background-color: #10b981;
    border-color: #10b981;
}

.todo-item__checkbox:hover {
    border-color: #10b981;
}

.todo-item__text {
    flex: 1;
    font-size: 1rem;
    font-weight: 500;
    color: #1f2937;
    line-height: 1.4;
    letter-spacing: -0.01em;
}

.todo-item__text--completed {
    text-decoration: line-through;
    color: #9ca3af;
}

.todo-item__delete {
    flex-shrink: 0;
}

.todo-item__add-subtask {
    display: flex;
    gap: 0.75rem;
    align-items: stretch;
    margin-bottom: 1rem;
}

.todo-item__subtask-input {
    flex: 1;
}

.todo-item__subtask-button {
    flex-shrink: 0;
    white-space: nowrap;
}

.todo-item__subtasks {
    margin-left: 2rem;
    border-left: 2px solid rgba(16, 185, 129, 0.1);
    padding-left: 1.5rem;
}

.todo-item__subtasks .todo-item {
    margin-bottom: 0.75rem;
    padding: 1rem;
}

/* Compact button variant */
.btn--compact {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
    border-radius: 8px;
    font-weight: 500;
}

/* Responsive design */
@media (max-width: 768px) {
    .todo-item {
        padding: 1.25rem;
    }
    
    .todo-item__header {
        gap: 0.75rem;
    }
    
    .todo-item__add-subtask {
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .todo-item__subtask-button {
        width: 100%;
    }
    
    .todo-item__subtasks {
        margin-left: 1rem;
        padding-left: 1rem;
    }
}

@media (max-width: 480px) {
    .todo-item__header {
        flex-wrap: wrap;
    }
    
    .todo-item__delete {
        order: 3;
        width: 100%;
        margin-top: 0.5rem;
    }
}
</style>
