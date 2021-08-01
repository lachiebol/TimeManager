<template>
  <div>
    <div>Today you are working from {{getTime(start.timeValue)}} {{start.timeFormat}} till {{getTime(end.timeValue)}} {{end.timeFormat}} {{difference/60}} hours</div>

    <div> 
      <draggable v-model="myArray">
        <transition-group>
            <div v-for="slot in dayRange" :key="slot">
                {{slot.timeValue}} {{slot.timeFormat}}
            </div>
        </transition-group>
      </draggable>
    </div>
  </div>


</template>

<script>
import {getTimeDifference, getTimeRange} from "../utilities/time";

import draggable from 'vuedraggable';

export default {
  props: ['start', 'end'],
  components: {
    draggable
  },

  data() {
    return {
      difference: null,
      dayRange: null,
    }
  },

  mounted() {
    this.difference = getTimeDifference(this.start, this.end)

    this.dayRange = getTimeRange(this.start, this.end, 30);

    console.log(this.dayRange)
    
  },

  methods: {
    getTime(timeString) {
      return `${timeString.slice(0,2)}:${timeString.slice(2,4)}`
    },


  },


  computed: {

    timeSlots: function() {
      let slots = [];
      for(let i = 0; i < this.difference; i += 30) {
        slots.push(i);
      }

      return slots
    }
  }

}
</script>

<style>

</style>