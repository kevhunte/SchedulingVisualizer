<template>
<div>
  <h3 class="pb-2">First Come, First Serve</h3>

  <h6 class="pb-2">
    This algorithm schedules processes for execution by their arrival time.
  </h6>

  <h6 class="pb-2 animated fadeIn delay-2s">
    The below queue shows the amount of processes waiting to execute.<br> Each process executes for 5 seconds.
  </h6>

  <div id="simContainer" v-if="this.localCopy" class="p-4 animated fadeIn delay-4s">
    <b-progress :value="this.localCopy.length" :max="initLength"></b-progress>
    <h6>
      Remaining Processes: {{this.localCopy.length}}
    </h6>
    <b-button v-if="!this.isPaused && this.currProcess" pill @click="stopTimer()" variant="info">Pause</b-button>
    <b-button v-else-if="this.isPaused && this.currProcess" pill @click="startTimer()" variant="info">Resume</b-button>

    <span class="" v-if="this.localCopy.length > 3 && this.iters >= 3">
      <strong @click="speedUpTimer"> Speed Up (4x) </strong>
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
        remaining burst time: {{this.currProcess.burstTime}}s
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
    },
    quantum: {
      type: Number,
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
      summedTimeUsed: 0,
      iters: 0,
      result: {
        id: 1,
        Algorithm: 'FCFS'
      },
      speedUp: false
    }
  },
  methods: {
    execute() {
      this.runTime += 1; // simulate dispatch latency
      this.iters += 1;
      let remainingTime = 0;
      this.currProcess = this.localCopy.shift(); // dequeque process
      if (this.currProcess) { // do math for other variables
        if (this.quantum > this.currProcess.burstTime) {
          remainingTime = this.quantum - this.currProcess.burstTime;
        }
        //remaining burst time after execution
        this.currProcess.burstTime = this.currProcess.burstTime - this.quantum > 0 ? this.currProcess.burstTime - this.quantum : 0;
        // timeUsed in CPU.
        let currTimeUsed = this.quantum - remainingTime;
        this.currProcess.timeUsed += currTimeUsed;

        //Propogate this timeUsed to all threads turnaround time that have already started
        this.localCopy.forEach((item, i) => {
          if (item.timeUsed != 0) {
            item.timeUsed += currTimeUsed;
          }
        });

        this.runTime += currTimeUsed;
        this.waitTime += this.localCopy.length < this.initLength - 1 ? currTimeUsed : 0;

        if (this.currProcess.burstTime > 0) { // if burst time is greater than 0 back in queue
          this.localCopy.push(this.currProcess);
        } else { // store process total timeUsed before it is tossed
          this.summedTimeUsed += this.currProcess.timeUsed;
        }
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
