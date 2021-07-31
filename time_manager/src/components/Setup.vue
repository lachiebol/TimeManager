<template>
  <div>
    <div id="head">
      <h1 id="header">Time Manager</h1>
      <h2>Welcome!</h2>
      <h3>This site allows you to plan out your day</h3>
      <p id="to-start">To start, just fill out what hours you plan on working today</p>
    </div>


    <div id="input-area">
      <b-form>
        <p class="from-to">From <span class="time-format">(hh:mm)</span> </p>
        <div id="start" class="time-input-container">
          <the-mask class="time-input" v-model="start" :mask="['##:##']"></the-mask>

          <b-form-radio-group
          class="am-pm-radio"
          v-model="selected.start"
          :options="timeOptions"
          name="from-options"
          >
          </b-form-radio-group>
        </div>
        <p class="from-to">To <span class="time-format">(hh:mm)</span> </p>
        <div id="end" class="time-input-container">

          <the-mask class="time-input" v-model="end" :mask="['##:##']"></the-mask>

          <b-form-radio-group
          class="am-pm-radio"
          v-model="selected.end"
          :options="timeOptions"
          name="to-options"
          >
          </b-form-radio-group>



        </div>
      </b-form>

      <b-button @click="submitTime">Start</b-button>
    </div>

  </div>
</template>

<script>
import { TheMask } from 'vue-the-mask';
import { timeFormat, getTimeDifference} from "../utilities/time";

export default {
  components: {
    TheMask
  },


  data() {
    return {
      start: "0900",
      end: "0500",
      selected: {
        start: timeFormat.AM,
        end: timeFormat.PM
      },
      timeOptions: [
        { text: 'am', value: timeFormat.AM},
        { text: 'pm', value: timeFormat.PM}
      ]   
    }
  },

  methods: {

    submitTime() {
      console.log(getTimeDifference(this.start, this.end, this.selected))
    }

  }

}
</script>

<style>

#header {
  margin-bottom: 30px;
}

#to-start {
  margin-top: 30px;
  font-size: 18px;
}

.time-input-container {
  width: 200px;
  height: 30px;
  margin: auto;
  font-size: 18px;
  margin-bottom: 30px;
  display: flex;
}

.time-input {
  width: 200px;
  text-align: center;
  font-size: 18px;
}

.time-format {
  font-size: 12px;
}

.from-to {
  margin-bottom: 0px
}

.am-pm-radio {
  font-size: 13px;
  float: right;
  display: flex;
  justify-content: space-between;
}

.custom-radio {
  margin-left: 10px;
}

#start-button {
  background: ;
}

</style>