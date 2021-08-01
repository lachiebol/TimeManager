<template>
  <div class="home">
    <Setup @finishSetup="setupFinished" v-if="!setup"></Setup>

    <transition name="slide">
       <MainPage :start="start" :end="end" v-if="setup"></MainPage>
    </transition>
   

  </div>
</template>

<script>

import Setup from "../components/Setup.vue"
import MainPage from "../components/MainPage.vue"

export default {
  name: 'Home',
  components: {
    Setup,
    MainPage
  },

  data() {
    return {
      setup: null,
      start: null,
      end: null,
    }
  },

  methods: {
    setupFinished(e) {
      this.start = e[0]
      this.end = e[1]
      this.setup = true;
    }
  }


}
</script>

<style>

.slide-leave-active,
.slide-enter-active {
  transition: 1s;
}
.slide-enter {
  transform: translate(100%, 0);
}
.slide-leave-to {
  transform: translate(-100%, 0);
}

.img-slider{
  overflow: hidden;
  position: relative;
  height: 200px;
  width: 400px;
}

.img-slider img {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right:0;
}

</style>
