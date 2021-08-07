<template>
  <div>
    <!-- <div id="day-info">Today you are working from {{getTime(start.timeValue)}} {{start.timeFormat}} till {{getTime(end.timeValue)}} {{end.timeFormat}}</div> -->
    <h1 id="header">Time Fixinator</h1>
    <div id="no-space">
      <span v-if="noSpace">No space available, please re-order then try again</span>
    </div>
    <b-container id="content-container">
      <b-row>
        <b-col cols="7">

          <b-container id="timeline-container">
            <b-row>
              <b-col cols="3" id="time-value-col">
                <div v-for="slot in dayRange" :key="slot" id="time-values">
                  <span>{{slot.timeValue}} {{slot.timeFormat}}</span>
                </div>
              </b-col>
              <b-col cols="6" id="timeline-col">
                <draggable v-model="displayTasks" v-bind="dragOptions" @start="drag=true" @end="drag = false">
                  <transition-group type="transition" :css="animated" :name="!drag ? 'flip-list' : null">
                      <div v-for="item in displayTasks" :key="item.id">
                        <TaskDisplay :task="item" @removeTask="removeTask" :position="'inTimeline'"></TaskDisplay>
                      </div>
                  </transition-group>
                </draggable>
              </b-col>
            </b-row>
          </b-container>
        </b-col>

        <b-col cols="4">
          <TaskCreator @addTask="addTask" ref="taskCreator"></TaskCreator>
        </b-col>
      </b-row>

    </b-container>
 

  </div>


</template>

<script>
import {getTimeDifference, getTimeRange, timeFormat} from "../utilities/time";

import draggable from 'vuedraggable';
import TaskCreator from '../components/TaskCreator';
import TaskDisplay from '../components/TaskDisplay'
import { slotType } from '../utilities/slot';

export default {
  components: {
    draggable,
    TaskCreator,
    TaskDisplay
  },

  data() {
    return {

      start: {
        timeValue: "0900",
        timeFormat: timeFormat.AM
      },
      end: {
        timeValue: "0500",
        timeFormat: timeFormat.PM
      },
      difference: null,
      dayRange: null,
      animated: true,
      add: false,
      noSpace: false,
      tasks: [
      ],

      displayTasks: null,
      drag: false
    }
  },

  watch: {
    displayTasks: function() {
      this.updateTasks()
    },

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
     * Adds task to 
     * @param {string} timeString
     */
    addTask(task) {
      let curSlot = 0;
      let foundSlot = false;
      for (let curTask of this.displayTasks) {
        foundSlot = true;
        if (curTask.type == slotType.EMPTY) {
          let numSlots = task.duration / 30;

          for (let i = 0; i < numSlots; i++) {
            if(curSlot + i < this.displayTasks.length && this.displayTasks[curSlot + i].type == slotType.TASK) {
              foundSlot = false;
            } 

            if(curSlot + i > this.displayTasks.length) {
              foundSlot = false;
            } 
          }

          if(foundSlot) {
                
            this.noSpace = false;
            this.animated = false;
            this.$refs.taskCreator.removeTask(task)
            task.startTime = curTask.startTime;
            task.id = curTask.id;
            task.timeFormat = curTask.timeFormat
            this.tasks.push(task);
            this.displayTasks = this.getTasksToDisplay();

            return
          } 

        }
        foundSlot = false;
        curSlot++;
      }
      
      if(!foundSlot) this.noSpace = true;

    },


    removeTask(task) {
      this.tasks = this.tasks.filter(x => x != task);
      this.$refs.taskCreator.addTaskToList(task);
      this.displayTasks = this.getTasksToDisplay();
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

    isEmpty(task) {
      return task.type == slotType.EMPTY
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
  color: #88d376;
  background: #c8ebfb;
}


#content-container {
  margin: auto;
  text-align: center;
}

#time-value-col {
  text-align: right;
  margin-right: 0px;
  padding-right: 0.25em;
}

#timeline-col {
  margin-top: 11px;
  /* padding-left: 0.25em; */
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
  color: #3d6774;
  height: 50px;
}

#no-space {
  position: relative;
  height: 20px;
  color: red;
}



#items {
  margin-top: 5px;
  float: right;

}










</style>