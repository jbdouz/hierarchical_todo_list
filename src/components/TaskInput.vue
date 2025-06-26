<script>
export default {
    name: 'TaskInput',
    emits: ['add-task'],
    data() {
        return {
            taskText: ''
        }
    },
    methods: {
        handleSubmit() {
            console.log(`handleSubmit() triggered, text: ${this.taskText}`)
            if (this.taskText.trim()) {
                this.$emit('add-task', this.taskText.trim());
                this.taskText = '';
            }
        },
        onKeyEnter() {
            this.handleSubmit();
        }
    },
}
</script>

<template>
    <div class="task-input">
        <input 
            v-model="taskText"
            @keyup.enter="onKeyEnter"
            placeholder="Add a new main task..."
            class="task-input__field input input--large"
        >
        <button @click="handleSubmit" class="task-input__button btn btn--success btn--large">
            Add Task
        </button>
    </div>
</template>

<style scoped>
.task-input {
    display: flex;
    gap: 1rem;
    align-items: stretch;
    margin-bottom: 1.5rem;
}

.task-input__field {
    flex: 1;
    margin: 0;
}

.task-input__button {
    flex-shrink: 0;
    white-space: nowrap;
}

/* Responsive design */
@media (max-width: 768px) {
    .task-input {
        flex-direction: column;
        gap: 0.75rem;
    }
    
    .task-input__button {
        width: 100%;
    }
}
</style>