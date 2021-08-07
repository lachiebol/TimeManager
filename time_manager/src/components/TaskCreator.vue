<template>
  <b-container id="creator-container">

    <b-button id="add-task-button">Create Task</b-button>
    <b-popover target="add-task-button" triggers="focus">
      <b-form-input v-model="newTaskTitle" placeholder="Task Title"></b-form-input>
      <b-form-input v-model="newTaskDescription" placeholder="Task Description"></b-form-input>
      <b-form-spinbutton
      id="select-duration"
      v-model="durationIndex"
      :formatter-fn="durationFormatter"
      min="0"
      max="16"
      />

      <b-button @click="createTask">Create</b-button>
    </b-popover>
    <div v-for="task in tasks" :key="task.id">
      <TaskDisplay :task="task" @addTask="addToTasks" :position="'inCreator'"></TaskDisplay>
    </div>
  </b-container>


</template>
<script>
import { timeFormat } from '../utilities/time';
import { slotType } from '../utilities/slot';
import TaskDisplay from '../components/TaskDisplay';
export default {
  components: {
    TaskDisplay
  },
  data() {
    return {
      durationIndex: 0,
      newTaskTitle: null,
      newTaskDescription: null,

      tasks: [
       {
          id: 0,
          title: 'Attend Meeting',
          duration: 30,
          description: 'task 1',
          timeFormat: timeFormat.AM,
          type: slotType.TASK
        },
      ],
    };
  },

  methods: {
    /**
     * Adds task to list of available tasks
     * @param Task task that is going to be added
     */
    addTaskToList(task) {
      this.tasks.push(task);
    },

    /**
     * Creates new tasks from data inputted in form
     */
    createTask() {
      let newTask;
      let newId;
      if(this.tasks.length != 0) {
        newId = this.tasks[this.tasks.length - 1].id + 1
      } else {
        newId = 0;
      }
      newTask = {
        id: newId,
        title: this.newTaskTitle,
        duration: this.getDurations[this.durationIndex].duration,
        description: this.newTaskDescription,
        timeFormat: timeFormat.AM,
        type: slotType.TASK
      }
      this.tasks.push(newTask)

      this.clearForm();
    },

    /**
     * Clears values in popup form for adding tasks
     */
    clearForm() {
      this.durationIndex = 0
      this.newTaskTitle = null,
      this.newTaskDescription = null
    },


    /**
     * Emits event to parent (MainPage) that adds task to time schedule
     * @param task task that is going to be added to schedule
     */
    addToTasks: function(task) {
      this.$emit("addTask", task)
    },


    /**
     * Formatter used for spin button, gets time value (eg. 1 hour 30 minutes) to be displayed
     * @param index index of value in spin button
     */
    durationFormatter(index) {
      return this.getDurations[index].value
    },

     /**
     * Removes task from list of available tasks, called when task is added to schedule
     * @param task task that is being added to schedule
     */
    removeTask(task) {
      this.tasks = this.tasks.filter(x => x != task);
    }

    
  },

  computed: {
    /**
     * Gets values for duration, used in spin button
     */
    getDurations() {
      let currentHour = 1;
      let durations = [];
      for (let i = 0; i < 16; i++) {
        if (i == 0) {
          durations.push({value: '30 Minutes', duration: 30})
        } else if (i % 2 == 0) {
          durations.push({value: `${currentHour} hours 30 minutes`, duration: 30 * (i + 1)})
          currentHour++;
        } else {
          if(currentHour == 1) {
            durations.push({value: `${currentHour} hour`, duration: 30 * (i + 1)})
          } else {     
            durations.push({value: `${currentHour} hours`, duration: 30 * (i + 1)})
          }
        }
      }

      return durations;
    }
  }
};
</script>

<style>
#add-task-button {

  margin-right: 15px;
  margin-bottom: 10px;
}

#select-duration {
  width: 300px;
  text-align: left;
}
</style>