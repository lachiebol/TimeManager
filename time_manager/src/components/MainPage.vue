<template>
  <div>
    <div id="day-info">Today you are working from {{getTime(start.timeValue)}} {{start.timeFormat}} till {{getTime(end.timeValue)}} {{end.timeFormat}}</div>

    <div id="timeslot-container"> 
      <div id="time-value-container">
        <div v-for="slot in dayRange" :key="slot" id="time-values">
          {{slot.timeValue}} {{slot.timeFormat}}
        </div>
      </div>
      <div id="items">
        <draggable v-model="displayTasks" v-bind="dragOptions" @start="drag=true" @end="drag = false">
          <transition-group type="transition" :name="!drag ? 'flip-list' : null">
            <div v-for="item in displayTasks" :key="item.id" id="item" :style="{height: getHeightOfTask(item.duration) + 'px', background: getColourOfTask(item.type)}">
                <div v-if="isTask(item)">
                  <div>{{item.title}}</div>
                  <div>{{item.description}}</div>
                  <div>{{item.duration}}</div>
                </div>
            </div>
          </transition-group>
        </draggable>
      </div>
    </div>
  </div>


</template>

<script>
import {getTimeDifference, getTimeRange, timeFormat} from "../utilities/time";

import draggable from 'vuedraggable';
import { slotType } from '../utilities/slot';

export default {
  props: ['start', 'end'],
  components: {
    draggable
  },

  data() {
    return {


      difference: null,
      dayRange: null,
      tasks: [
        {
          title: 'hi',
          duration: 120,
          startTime: '09:30',
          timeFormat: timeFormat.AM,
          description: 'task 1',
          type: slotType.TASK
        },
        {
          title: 'aye',
          duration: 60,
          startTime: '03:30',
          timeFormat: timeFormat.PM,
          description: 'task 2',
          type: slotType.TASK
        },
        {
          title: 'task',
          duration: 30,
          startTime: '04:30',
          timeFormat: timeFormat.PM,
          description: 'task 3',
          type: slotType.TASK
        }
      ],

      displayTasks: null,
      drag: false
    }
  },

  watch: {
    displayTasks: function() {
      this.updateTasks()
    }
  },

  mounted() {
    this.difference = getTimeDifference(this.start, this.end)

    this.dayRange = getTimeRange(this.start, this.end, 30);

    this.displayTasks = this.getTasksToDisplay()

    
  },

  methods: {

    /**
     * Gets time in format to be displayed on page
     * @param {string} timeString
     */
    getTime(timeString) {
      return `${timeString.slice(0,2)}:${timeString.slice(2,4)}`
    },

    /**
     * Calculates height of task element, so it can be displayed in the correct time slots
     * @param {number} taskLength duration of the task
     */
    getHeightOfTask(taskLength) {
      return taskLength * 1.7;
    },


    /**
     * Gets colour of task element, depending on task type
     * @param {slotType} taskType type of task (task or empty)
     */
    getColourOfTask(taskType) {
      if(taskType == slotType.TASK) {
        return 'lightgreen'
      } else if (taskType == slotType.EMPTY) {
        return 'lightgrey';
      }
    },


    /**
     * Gets list of tasks to display on screen, fills empty spots with empty tasks
     */
    getTasksToDisplay() {
      let data = [];

      let slots = this.dayRange.length - 1;
      let currentSlot = 0;
      while (currentSlot < slots) {
        const dayRangeValue = this.dayRange[currentSlot]

        const matchedTask = this.tasks.filter(x => (x.startTime == dayRangeValue.timeValue && x.timeFormat == dayRangeValue.timeFormat))

        if(matchedTask.length > 0) {
          let task = matchedTask[0];

          task.id = currentSlot;
      
          data.push(task);

          currentSlot += task.duration / 30
        } else {

          data.push({
            id: currentSlot,
            title: 'free',
            startTime: this.dayRange[currentSlot].timeValue,
            timeFormat: this.dayRange[currentSlot].timeFormat,
            duration: 30,
            type: slotType.EMPTY
          })

          currentSlot += 1;
        }
      }


      return data;
    },

    isTask(task) {
      return task.type == slotType.TASK
    },


    updateTasks() {

      let changed = false; //variable to prevent watch loop, will only update display tasks if altered

      let currentSlot = 0; //used to index into timeslot

      for (let curTask of this.displayTasks) {
        if(curTask.startTime != this.dayRange[currentSlot].timeValue && curTask.type == slotType.TASK) {

          let task = this.tasks.filter(x => x.id == curTask.id)[0];
          task.startTime = this.dayRange[currentSlot].timeValue;
          task.timeFormat = this.dayRange[currentSlot].timeFormat
          changed = true;
        }
        currentSlot += curTask.duration / 30
      }
      console.log(this.tasks)

      if(changed) this.displayTasks = this.getTasksToDisplay();

    }


  },


  computed: {

    timeSlots() {
      let slots = [];
      for(let i = 0; i < this.difference; i += 30) {
        slots.push(i);
      }

      return slots
    },

    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }

  
  }

}
</script>

<style>


.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}


#day-info {
  font-size: 20px;
  margin-bottom: 40px;;
}

#time-value-container {
  float: left;
}

#timeslot-container {
  width: 20%;
  margin: auto;
}

#time-values {
  height: 50px
}

#items {
  margin-top: 5px;
  float: right;
}

#item {
  background: lightgreen;
  border-style: solid;
  border-width: 1px;
  width: 250px;
  cursor:grab;
}







</style>