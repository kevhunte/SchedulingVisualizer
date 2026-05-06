<template>
<div>
  <h3 class="pb-2">Round Robin Scheduling</h3>

  <h6 class="pb-2">
    This algorithm schedules processes for execution by their arrival time.
    Processes are executed for the time provided in the time quantum.
  </h6>

  <h6 class="pb-2 animated fadeIn delay-2s">
    The below queue shows the amount of processes waiting to execute.<br>
    Each process executes for the time quantum selected above.
  </h6>

  <div id="simContainer" v-if="localCopy" class="p-4 animated fadeIn delay-4s">
    <div class="progress mb-2">
      <div
        class="progress-bar"
        role="progressbar"
        :style="{ width: (localCopy.length / initLength * 100) + '%' }">
      </div>
    </div>
    <h6>Remaining Processes: {{ localCopy.length }}</h6>

    <button v-if="!isPaused && currProcess" class="btn btn-info rounded-pill text-white" @click="stopTimer()">Pause</button>
    <button v-else-if="isPaused && currProcess" class="btn btn-info rounded-pill text-white" @click="startTimer()">Resume</button>

    <span v-if="localCopy.length > 3 && iters >= 3" class="ms-2">
      <strong style="cursor:pointer" @click="speedUpTimer">Speed Up (4x)</strong>
    </span>

    <div id="processInstance" v-if="currProcess" class="col-md-7 mx-auto p-1 animated fadeIn">
      <h6><b><i>Executing</i></b></h6>
      <h6>pid: {{ currProcess.id }}</h6>
      <h6>priority: {{ currProcess.priority }}</h6>
      <h6>remaining burst time: {{ currProcess.burstTime }}s</h6>
    </div>

    <div v-if="localCopy.length > 0" class="mt-3">
      <h6 class="text-muted mb-2">Up Next:</h6>
      <div class="d-flex justify-content-center gap-2 flex-wrap">
        <div v-for="(p, index) in localCopy.slice(0, 3)" :key="p.id"
             class="card border-secondary text-start"
             style="min-width: 110px; opacity: 0.75">
          <div class="card-body p-2 small">
            <div class="text-muted fw-bold mb-1">#{{ index + 1 }} in queue</div>
            <div>pid: {{ p.id }}</div>
            <div>priority: {{ p.priority }}</div>
            <div>burst: {{ p.burstTime }}s</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { useResultsStore } from '../store/results'

export default {
  name: 'RR',
  props: {
    proc: { type: Array, required: true },
    quantum: { type: Number, required: true }
  },
  setup() {
    return { resultsStore: useResultsStore() }
  },
  created() {
    if (this.proc) {
      this.localCopy = this.proc.slice()
    }
  },
  mounted() {
    setTimeout(() => { this.startTimer() }, 4000)
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
      result: { id: 3, Algorithm: 'RR' },
      speedUp: false
    }
  },
  methods: {
    execute() {
      this.runTime += 1
      this.iters += 1
      let remainingTime = 0
      this.currProcess = this.localCopy.shift()
      if (this.currProcess) {
        if (this.quantum > this.currProcess.burstTime) {
          remainingTime = this.quantum - this.currProcess.burstTime
        }
        this.currProcess.burstTime = this.currProcess.burstTime - this.quantum > 0
          ? this.currProcess.burstTime - this.quantum : 0
        const currTimeUsed = this.quantum - remainingTime
        this.currProcess.timeUsed += currTimeUsed
        this.localCopy.forEach(item => {
          if (item.timeUsed !== 0) item.timeUsed += currTimeUsed
        })
        this.runTime += currTimeUsed
        this.waitTime += this.localCopy.length < this.initLength - 1 ? currTimeUsed : 0
        if (this.currProcess.burstTime > 0) {
          this.localCopy.push(this.currProcess)
        } else {
          this.summedTimeUsed += this.currProcess.timeUsed
        }
      }
    },
    startTimer() {
      this.t = setInterval(() => {
        if (!this.localCopy.length) {
          clearInterval(this.t)
          this.sendtoParent()
        }
        this.execute()
      }, this.interval)
      this.isPaused = false
    },
    stopTimer() {
      clearInterval(this.t)
      this.isPaused = true
    },
    speedUpTimer() {
      if (!this.speedUp) {
        clearInterval(this.t)
        this.interval = 500
        this.startTimer()
      }
      this.speedUp = true
    },
    sendtoParent() {
      this.result.utilization = 1 - (((this.waitTime / this.initLength) * 0.001) ** this.initLength).toPrecision(2)
      this.result.throughput = this.runTime > 0
        ? +(this.initLength / (this.runTime * 0.001)).toFixed(2) : 0
      this.result.avgWaitTime = (this.waitTime / this.initLength).toFixed(2)
      this.result.turnaround = (this.runTime / this.initLength).toFixed(2)
      this.resultsStore.passResults(this.result)
    }
  }
}
</script>

<style></style>
