<template>
  <div>
    <div>Today you are working from {{getTime(start.timeValue)}} {{start.timeFormat}} till {{getTime(end.timeValue)}} {{end.timeFormat}} {{difference/60}} hours</div>

    <div id="timeslot-container"> 
      <div id="time-value-container">
        <div v-for="slot in dayRange" :key="slot" id="time-values">
          {{slot.timeValue}} {{slot.timeFormat}}
        </div>
      </div>
      <div id="items">
        <draggable v-model="tasks">
          <transition-group>
            <div v-for="item in tasks" :key="item.id" id="item" :style="{height: getHeightOfTask(item.duration) + 'px', background: getColourOfTask(item.type)}" @click="test">
                {{item.title}} {{item.description}}
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
          id: 1,
          title: 'hello',
          duration: 120,
          startTime: '09:30',
          timeFormat: timeFormat.AM,
          description: 'i shit my pant',
          type: slotType.TASK
        },
        {
          id: 2,
          title: 'yeloe',
          duration: 60,
          startTime: '03:30',
          timeFormat: timeFormat.PM,
          description: 'i shit my pant',
          type: slotType.TASK
        },
        {
          id: 3,
          title: 'elo',
          duration: 30,
          startTime: '04:30',
          timeFormat: timeFormat.PM,
          description: 'i shit my pant',
          type: slotType.TASK
        }
      ]
    }
  },

  watch: {
    tasks: function() {

    }
  },

  mounted() {
    this.difference = getTimeDifference(this.start, this.end)

    this.dayRange = getTimeRange(this.start, this.end, 30);

    this.tasks = this.getTasksToDisplay()
    
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

  
  }

}
</script>

<style>

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
  width: 200px;
  cursor:grab;
}







</style>