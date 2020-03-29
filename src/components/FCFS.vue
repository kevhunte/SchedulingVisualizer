<template>
<div>
  <h3 class="pb-2">First Come, First Serve</h3>

  <h6 class="pb-2">
    This algorithm schedules processes for execution by their arrival time.
  </h6>

  <h6 class="pb-2 animated fadeIn delay-2s">
    The below queue shows the amount of processes waiting to execute.
  </h6>

  <div id="simContainer" v-if="this.localCopy.length" class="p-4 animated fadeIn delay-4s">
    <b-progress :value="this.localCopy.length" :max="initLength"></b-progress>
    <h6>
      Remaining Processes: {{this.localCopy.length}}
    </h6>
    {{this.currProcess}}
  </div>
  <h5>
    -- Show formulas here. Compute and send in dispatch to parent? Or show locally (decide later)---<br>
    Throughput <br>
    Utilization <br>
    Avg wait time <br>
    Avg turnaround time <br>


  </h5>

</div>
</template>

<script>
export default {
  name: 'FCFS',
  props: {
    proc: {
      type: Array,
      required: true
    }
  },
  created() {
    if (this.proc) {
      this.localCopy = this.proc.slice();
    }
  },
  mounted() {
    // wait 4 seconds, then startTimer
    setTimeout(() => {
      this.startTimer()
    }, 4000);
    //this.startTimer();
  },
  data() {
    return {
      interval: 2000,
      initLength: this.proc.length,
      currProcess: null,
      localCopy: null
    }
  },
  watch: {},
  methods: {
    execute() {
      if (!this.localCopy) { // check if empty
        clearInterval(); // breaks loop when empty
        return;
      }
      //console.log('executing...');
      this.currProcess = this.localCopy.shift(); // dequeque process
      // do math for other variables
    },
    startTimer() { // start animation train
      console.log("starting...");
      setInterval(() => {
        this.execute()
        // keep track of total time needed. Inc clock ticks
      }, this.interval);
    },
    stopTimer() {
      clearInterval();
    }
  }
}
</script>

<style lang="scss">
.progress-bar {
    background-color: #42B983;
}
</style>
