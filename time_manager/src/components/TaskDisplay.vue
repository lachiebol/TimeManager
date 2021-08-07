<template>
    <b-container id="container" v-if="loaded">
      <transition name="expand" v-show="adding">
        <b-row cols="2" id="item" :style="{height: getHeightOfTask(task.duration) + 'px', background: getColourOfTask(task.type)}"  :class="{'dotted': isTask(task)}">
          <b-col cols="3" v-if="isTask(task)" id="title">
            {{task.title}}
          </b-col>
          <b-col cols="1" v-if="position == 'inTimeline' && task.type=='task'" class="operation">
            <b-icon class="icon" icon="dash" @click="removeTaskFromTimeline"></b-icon>
          </b-col>
          <b-col cols="1" v-else-if="position == 'inCreator'" class="operation" >
            <b-icon class="icon" icon="plus" @click="addTaskToTimeline"></b-icon>
          </b-col>

        </b-row>
      </transition>
    </b-container>

</template>

<script>

import { slotType } from '../utilities/slot';
export default {
  props: ['task', 'position'],

  data() {
    return {
      adding: false,
      loaded: false
    }
  },


  mounted(){
    console.log(this.position)
    this.loaded = true;
  },


  methods: {
    /**
     * Calculates height of task element, so it can be displayed in the correct time slots
     * @param {number} taskLength duration of the task
     */
    getHeightOfTask(taskLength) {
      return 50 * (taskLength / 30)
    },

    addTaskToTimeline() {
      this.$emit("addTask", this.task)
    },

    removeTaskFromTimeline() {
      this.$emit("removeTask", this.task)
    },

    /**
     * Gets colour of task element, depending on task type
     * @param {slotType} taskType type of task (task or empty)
     */
    getColourOfTask(taskType) {
      console.log(slotType.TASK)
      if(taskType == slotType.TASK) {
        return 'linear-gradient(to right, #5492a5, #82d2eb)'
      } else if (taskType == slotType.EMPTY) {
        return 'linear-gradient(to right, #d4d4d4, #FFFFFF)';
      }
    },

    isTask(task) {
      return task.type == slotType.TASK
    },
  }
}
</script>

<style>

.dotted {
  border-bottom: solid;
  border-color: white;
  border-width: 2px;
}

#item {
  width: 100%;
  /* display: flex; */
  /* flex-flow: column wrap; */
  justify-content: center;
  color: white;
  
  cursor:grab;
}

#title {
  position: absolute;
  align-self: center;
  margin-right: auto;
  width: 300px;
  
}

#container {
  width: 100%;
  padding: 0;
}

.icon {
  cursor: pointer;
}

.operation {
  margin-bottom: auto;
  margin-left: auto;
  font-size: 30px;
  margin-right: 15px;
}


</style>