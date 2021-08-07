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
          title: 'Drop kids off at lake i will',
          duration: 30,
          description: 'task 1',
          timeFormat: timeFormat.AM,
          type: slotType.TASK
        },
      ],
    };
  },

  mounted() {
    console.log(this.getDurations);
  },
  methods: {

    addTaskToList(task) {
      this.tasks.push(task);
    },

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

    clearForm() {
      this.durationIndex = 0
      this.newTaskTitle = null,
      this.newTaskDescription = null
    },

    addToTasks: function(task) {
      this.$emit("addTask", task)
    },

    durationFormatter(index) {
      return this.getDurations[index].value
    },


    removeTask(task) {
      this.tasks = this.tasks.filter(x => x != task);
    }

    
  },

  computed: {
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