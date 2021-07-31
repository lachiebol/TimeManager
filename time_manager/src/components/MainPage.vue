<template>
  <div>Today you are working from {{startTime}} {{start.timeFormat}} till {{endTime}} {{end.timeFormat}}</div>
</template>

<script>
export default {
  props: ['start', 'end'],


  computed: {
    startTime: function() {
      return `${this.start.timeValue.slice(0,2)}:${this.start.timeValue.slice(2,4)}`
    },

    endTime: function() {
      return `${this.end.timeValue.slice(0,2)}:${this.end.timeValue.slice(2,4)}`
    }
  }

}
</script>

<style>

</style>