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
        <div class="time-input-wrapper">
          <div id="start" class="time-input-container">
            <the-mask class="time-input" v-model="start.timeValue" :mask="['##:##']"></the-mask>

            <b-form-radio-group
            class="am-pm-radio"
            v-model="start.timeFormat"
            :options="timeOptions"
            name="from-options"
            >
            </b-form-radio-group>

          </div>
          <div class="time-error">{{start.error}}</div>
        </div>
 

        <p class="from-to">To <span class="time-format">(hh:mm)</span> </p>
        <div class="time-input-wrapper">
          <div id="end" class="time-input-container">

            <the-mask class="time-input" v-model="end.timeValue" :mask="['##:##']"></the-mask>

            <b-form-radio-group
            class="am-pm-radio"
            v-model="end.timeFormat"
            :options="timeOptions"
            name="to-options"
            >
            </b-form-radio-group>



          </div>
          <div class="time-error">{{end.error}}</div>
        </div>
 
      </b-form>

      <b-button @click="submitTime" :disabled="start.error != null || end.error != null">Start</b-button>
    </div>

  </div>
</template>

<script>
import { TheMask } from 'vue-the-mask';
import { timeFormat, getTimeValues} from "../utilities/time";

export default {
  components: {
    TheMask
  },


  data() {
    return {
      start: {
        timeValue: "0900",
        error: null,
        timeFormat: timeFormat.AM
      },
      end: {
        timeValue: "0500",
        error: null,
        timeFormat: timeFormat.PM
      },

      timeOptions: [
        { text: 'am', value: timeFormat.AM},
        { text: 'pm', value: timeFormat.PM}
      ],
      
    }
  },

  watch: {
    'start.timeValue': function() {
      this.checkTime(this.start)
    },

    'end.timeValue': function() {
      this.checkTime(this.end)
    }
  },

  methods: {

    submitTime() {
      this.$emit("finishSetup", [this.start, this.end])
    },

    /**
     * Checks input time for validation errors, used inside watchers for start and end time
     * @param time Time object that is going to be checked
     */
    checkTime(time) {
      const [hours, minutes] = getTimeValues(time.timeValue);
      if(hours > 12 || minutes > 60){
        time.error = "Bad time format"
      } else {
        time.error = null
      }
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

  display: flex;
}

.time-input-wrapper {
  margin-bottom: 30px;
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

.time-error {
  height: 10px;
  font-size: 13px;
  margin-bottom: auto;
  color: red;
}

</style>