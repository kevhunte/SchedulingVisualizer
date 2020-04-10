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
    <b-button v-if="!this.isPaused && this.currProcess" pill @click="stopTimer()" variant="info">Pause</b-button>
    <b-button v-else-if="this.isPaused && this.currProcess" pill @click="startTimer()" variant="info">Resume</b-button>

    <span class="" v-if="this.localCopy.length > 3 && this.localCopy.length < this.initLength - 2">
      <strong @click="speedUpTimer"> 4x </strong>
    </span>

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
  components: {},
  created() {
    if (this.proc) {
      this.localCopy = this.proc.slice();
    }
  },
  mounted() {
    setTimeout(() => {
      this.startTimer()
    }, 4000);
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
      result: {
        id: 1,
        Algorithm: 'FCFS'
      },
      speedUp: false
    }
  },
  methods: {
    execute() {
      this.runTime += 1;
      this.currProcess = this.localCopy.shift();
      if (this.currProcess) {
        this.runTime += this.currProcess.burstTime;
        this.waitTime += this.localCopy.length < this.initLength - 1 ? this.currProcess.burstTime : 0;
      }

    },
    startTimer() {
      this.t = setInterval(() => {
        if (!this.localCopy.length) {
          clearInterval(this.t);
          this.sendtoParent();
        }
        this.execute();
      }, this.interval);
      this.isPaused = false;
    },
    stopTimer() {
      clearInterval(this.t);
      this.isPaused = true;
    },
    speedUpTimer() {
      if (!this.speedUp) {
        clearInterval(this.t);
        this.interval = 500; // 4x speed
        this.startTimer();
      }
      this.speedUp = true;
    },
    sendtoParent(event) {
      this.utilization();
      this.throughput();
      this.avgWaitTime();
      this.turnaround();
      let data = {
        alg: 'FCFS',
        payload: this.result
      };
      this.$store.dispatch('passResults', data);
    },
    utilization() {
      let val = 1 - (((this.waitTime / this.initLength) * 0.001) ** this.initLength).toPrecision(2);
      this.result.utilization = val;
      return val;
    },
    throughput() {
      if (this.runTime > 0) {
        let val = +(this.initLength / (this.runTime * 0.001)).toFixed(2);
        this.result.throughput = val;
        return val;
      } else {
        return 0;
      }
    },
    avgWaitTime() {
      let val = (this.waitTime / this.initLength).toFixed(2);
      this.result.avgWaitTime = val;
      return val;
    },
    turnaround() {
      let val = (this.runTime / this.initLength).toFixed(2);
      this.result.turnaround = val;
      return val;
    }
  }
}
</script>

<style lang="scss">
</style>
