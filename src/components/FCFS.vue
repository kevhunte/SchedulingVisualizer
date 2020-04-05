<template>
<div>
  <h3 class="pb-2">First Come, First Serve</h3>

  <h6 class="pb-2">
    This algorithm schedules processes for execution by their arrival time.
  </h6>

  <h6 class="pb-2 animated fadeIn delay-2s">
    The below queue shows the amount of processes waiting to execute.
  </h6>

  <div id="simContainer" v-if="this.localCopy" class="p-4 animated fadeIn delay-4s">
    <b-progress :value="this.localCopy.length" :max="initLength"></b-progress>
    <h6>
      Remaining Processes: {{this.localCopy.length}}
    </h6>
    <!--Toggleable buttons to pause and resume-->
    <b-button v-if="!this.isPaused && this.currProcess" pill @click="stopTimer()" variant="info">Pause</b-button>
    <b-button v-else-if="this.isPaused && this.currProcess" pill @click="startTimer()" variant="info">Resume</b-button>
    <div id="processInstance" v-if="this.currProcess" class="col-md-7 mx-auto p-1 animated fadeIn">
      <h6>
        <b><i>Executing</i></b>
      </h6>
      <h6>
        pid: {{this.currProcess.id}}
      </h6>
      <h6>
        priority: {{this.currProcess.priority}}
      </h6>
      <h6>
        burst time: {{this.currProcess.burstTime}}s
      </h6>
    </div>
  </div>

  <div id="calcContainer" v-if="!this.localCopy.length" class="p-1 animated fadeIn delay-2s">
    <h5>
      <div class="p-1">
        Throughput: {{this.throughput}}
        <b-icon-question v-b-tooltip.click title="numProcesses / run-time"></b-icon-question>
      </div>
      <div class="p-1">
        Utilization: {{this.utilization}}
        <b-icon-question v-b-tooltip.click title="1 - (avg wait time ^ numProcesses)"></b-icon-question>
      </div>
      <div class="p-1">
        Avg Wait Time: {{this.avgWaitTime}}s
        <b-icon-question v-b-tooltip.click title="sum(Kth process start time) / numProcesses"></b-icon-question>
      </div>
      <div class="p-1">
        Avg Turnaround Time: {{this.turnaround}}s
        <b-icon-question v-b-tooltip.click title="sum(Kth process execution time) / numProcesses"></b-icon-question>
      </div>
    </h5>
  </div>

</div>
</template>

<script>
import {
  BIconQuestion
} from 'bootstrap-vue/src/icons'

export default {
  name: 'FCFS',
  props: {
    proc: {
      type: Array,
      required: true
    }
  },
  components: {
    BIconQuestion
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
      localCopy: null,
      t: null,
      isPaused: false,
      runTime: 0,
      waitTime: 0,
      result: {}
    }
  },
  computed: {
    utilization() {
      // calc the utilization: 1 - avgWaitTime ^ numProcesses
      // skip first process: if localCopy.length < initLength and > 0
      let val = 1 - (((this.waitTime / this.initLength) * 0.001) ** this.initLength).toPrecision(2);
      //console.log('utilization: ', val);
      this.result.utilization = val;
      return val;
    },
    throughput() {
      // calc the throughput: numProcesses / runTime
      //console.log('computing throughput', this.runTime);
      if (this.runTime > 0) {
        let val = +(this.initLength / this.runTime).toPrecision(2);
        //console.log('throughput: ', val);
        this.result.throughput = val;
        return val;
      } else {
        return 0;
      }
    },
    avgWaitTime() {
      let val = (this.waitTime / this.initLength).toPrecision(2);
      this.result.avgWaitTime = val;
      return val;
    },
    turnaround() {
      // same as runTime / numProcesses since they are all completed in one go
      //console.log('runTime:', this.runTime, 'waitTime:', this.waitTime);
      let val = (this.runTime / this.initLength).toPrecision(2);
      this.result.turnaround = val;
      return val;
    }
  },
  methods: {
    execute() {
      //console.log('executing...');
      this.currProcess = this.localCopy.shift(); // dequeque process
      if (this.currProcess) { // do math for other variables
        // executes for full time needed
        this.runTime += this.currProcess.burstTime;
        this.waitTime += this.localCopy.length < this.initLength - 1 ? this.currProcess.burstTime : 0;
      }

    },
    startTimer() { // start animation train
      console.log("starting...");
      this.t = setInterval(() => {
        if (!this.localCopy.length) { // stops itself on completion and sends results
          clearInterval(this.t);
          this.sendtoParent();
        }
        this.execute()
        // keep track of total time needed. Inc clock ticks
      }, this.interval);
      this.isPaused = false;
    },
    stopTimer() {
      clearInterval(this.t); // see if this works. Or set to null
      this.isPaused = true;
    },
    sendtoParent(event) {
      let data = {
        alg: 'FCFS',
        payload: this.result
      };
      this.$store.dispatch('passResults', data); // sends to parent
      //console.log('sending:', data, this.$store);
    }
  }
}
</script>

<style lang="scss">
</style>
