<template>
<div id="app">
  <!-- Navbar -->
  <nav class="navbar navbar-dark bg-dark fixed-top">
    <div class="container-fluid">
      <span class="navbar-brand fw-bold">Scheduling Visualizer</span>
      <div class="position-relative">
        <button
          class="btn btn-outline-light btn-sm"
          :disabled="processes.length === 0"
          @click="dropdownOpen = !dropdownOpen">
          Algorithm<span v-if="Algorithm"> &mdash; {{ algLabel }}</span>
        </button>
        <ul v-if="dropdownOpen" class="dropdown-menu show position-absolute end-0 mt-1">
          <li v-for="alg in algorithms" :key="alg.key">
            <button
              class="dropdown-item"
              :class="{ 'fw-bold text-success': Algorithm === alg.key }"
              @click="setAlg(alg.key)">
              {{ alg.name }}
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <div id="otherData" class="col-lg-8 mx-auto">

    <!-- Intro section -->
    <div class="intro-section text-start p-4 mb-4 rounded border bg-light">
      <h4 class="fw-bold">What is this?</h4>
      <p class="mb-2">
        This tool simulates how an <strong>operating system dispatcher</strong> assigns CPU time to competing processes using different <strong>scheduling algorithms</strong>.
        Each algorithm prioritizes processes differently — affecting throughput, wait time, and CPU utilization.
      </p>
      <h6 class="fw-bold mt-3">How to use it:</h6>
      <ol class="mb-0">
        <li>Use the slider to choose how many processes to simulate (1–50)</li>
        <li>Click <strong>Generate Processes</strong> — each process gets a random burst time and priority</li>
        <li>Select a scheduling algorithm from the cards below (or the dropdown in the header)</li>
        <li>Watch the simulation run — pause, resume, or speed up anytime</li>
        <li>Try multiple algorithms and compare their performance in the results table</li>
      </ol>
    </div>

    <!-- Side ad (shown after processes generated) -->
    <AdUnit v-if="processes.length > 0" slot-id="4238599264" :key="'side'" />

    <!-- Algorithm selection cards (always visible, active after processes generated) -->
    <div class="row g-3 mt-3 mb-2">
      <div class="col-sm-6 col-lg-3" v-for="alg in algorithms" :key="alg.key">
        <div
          class="card h-100 alg-card"
          :class="{
            'border-success border-2 alg-card-active': Algorithm === alg.key,
            'alg-card-disabled': processes.length === 0
          }"
          @click="processes.length > 0 && setAlg(alg.key)"
          :style="processes.length > 0 ? 'cursor: pointer' : 'cursor: not-allowed; opacity: 0.5'">
          <div class="card-body text-start">
            <h6 class="card-title fw-bold">{{ alg.name }}</h6>
            <p class="card-text small text-muted mb-0">{{ alg.desc }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Process controls -->
    <div id="processesContainer" class="mt-3">
      <h5>Select a number of processes to simulate:</h5>
      <input v-model="numProcesses" type="range" min="1" max="50" class="form-range px-4">
      <div v-if="numProcesses > 0">
        <h6>{{ numProcesses }}</h6>
        <button v-if="processes.length === 0" @click="generateProcesses()" class="btn btn-success rounded-pill">Generate Processes</button>
        <button v-else @click="clearProcesses()" class="btn btn-danger rounded-pill">Reset</button>
        <h6 v-if="processes.length > 0" class="pt-3">Number of Processes: {{ processes.length }}</h6>
        <h6 v-if="quant > 0" class="pt-3">Time quantum is set to: {{ quant }}s</h6>
      </div>
    </div>

    <!-- Round Robin quantum input -->
    <div v-if="Algorithm === 'RR' && quant <= 0" class="p-3 animated fadeIn">
      <h6>Select a time quantum value. This determines how long each process executes before cycling to the next.</h6>
      <div class="input-group mx-auto" style="max-width: 400px">
        <input
          v-model="quantIn"
          type="number"
          min="1"
          max="15"
          class="form-control"
          placeholder="Enter a number between 1 and 15">
        <button @click="setQuant" class="btn btn-info text-white">Accept</button>
      </div>
    </div>

    <!-- Algorithm simulation -->
    <div id="AlgContainer" class="p-3">
      <FCFS v-if="Algorithm === 'FCFS'" class="animated fadeIn" :proc="FCFSProcesses" :quantum="5" />
      <LRJF v-if="Algorithm === 'LRJF'" class="animated fadeIn" :proc="LRJFProcesses" :quantum="5" />
      <RR v-if="Algorithm === 'RR' && quant > 0" class="animated fadeIn" :proc="RRProcesses" :quantum="quant" />
      <PQ v-if="Algorithm === 'PQ'" class="animated fadeIn" :proc="PQProcesses" :quantum="5" />
    </div>

    <!-- Results table -->
    <div v-if="resultsStore.results.length > 0" id="ComparisonContainer" class="pb-3">
      <h6>Results:</h6>
      <div class="table-responsive">
        <table class="table table-striped table-hover mx-auto" style="width: 80%">
          <thead>
            <tr>
              <th v-for="f in fields" :key="f">{{ fieldLabels[f] }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in resultsStore.results" :key="row.Algorithm">
              <td v-for="f in fields" :key="f">{{ row[f] }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Metrics key -->
      <div class="text-start p-3 rounded border bg-light small mt-2 mx-auto" style="max-width: 600px">
        <strong>Metrics explained:</strong>
        <ul class="mb-0 mt-1">
          <li><strong>Throughput</strong> — processes completed per second</li>
          <li><strong>Utilization</strong> — fraction of time the CPU was actively executing (1.0 = 100%)</li>
          <li><strong>Avg Wait Time</strong> — average time a process spent waiting before it began executing</li>
          <li><strong>Turnaround</strong> — average total time from process arrival to completion</li>
        </ul>
      </div>
    </div>

    <!-- Banner ad (shown when results are available) -->
    <AdUnit v-if="resultsStore.results.length > 0" slot-id="5360109249" :key="'banner'" />

  </div>
</div>
</template>

<script>
import { useResultsStore } from './store/results'
import AdUnit from './components/AdUnit.vue'
import FCFS from './components/FCFS.vue'
import LRJF from './components/LRJF.vue'
import RR from './components/RoundRobin.vue'
import PQ from './components/PriorityQueue.vue'

export default {
  name: 'App',
  components: { FCFS, LRJF, RR, PQ, AdUnit },
  setup() {
    return { resultsStore: useResultsStore() }
  },
  data() {
    return {
      Algorithm: null,
      processes: [],
      FCFSProcesses: [],
      LRJFProcesses: [],
      PQProcesses: [],
      RRProcesses: [],
      numProcesses: 0,
      quantIn: '',
      quant: 0,
      dropdownOpen: false,
      fields: ['Algorithm', 'throughput', 'utilization', 'avgWaitTime', 'turnaround'],
      fieldLabels: {
        Algorithm: 'Algorithm',
        throughput: 'Throughput',
        utilization: 'Utilization',
        avgWaitTime: 'Avg Wait Time',
        turnaround: 'Turnaround'
      },
      algorithms: [
        {
          key: 'FCFS',
          name: 'FCFS',
          desc: 'First Come, First Served: processes run in arrival order. Simple and predictable, but short jobs may wait behind long ones.'
        },
        {
          key: 'LRJF',
          name: 'LRJF',
          desc: 'Longest Remaining Job First: prioritizes the longest jobs. Maximizes CPU utilization for burst-heavy workloads.'
        },
        {
          key: 'RR',
          name: 'Round Robin',
          desc: 'Each process gets a fixed time slice before cycling to the next. Balanced and responsive — requires setting a time quantum.'
        },
        {
          key: 'PQ',
          name: 'Priority Queue',
          desc: 'Processes with the highest priority execute first. Ideal for real-time or critical-task scenarios.'
        }
      ]
    }
  },
  computed: {
    selectedAlgorithm() {
      return this.algorithms.find(a => a.key === this.Algorithm) || null
    },
    algLabel() {
      const found = this.algorithms.find(a => a.key === this.Algorithm)
      return found ? found.name : this.Algorithm
    }
  },
  watch: {
    Algorithm(val) {
      if (val && !val.includes('RR')) {
        this.quantIn = ''
        this.quant = 0
      }
      this.dropdownOpen = false
    }
  },
  methods: {
    setQuant() {
      let val = parseInt(this.quantIn.replace(/[^0-9]+/g, ''))
      if (typeof val === 'number' && !isNaN(val)) {
        val = val > 15 ? 15 : val
        val = val < 1 ? 1 : val
        this.quant = val
      }
    },
    setAlg(alg) {
      this.Algorithm = alg
      this.dropdownOpen = false
    },
    generateProcesses() {
      if (this.numProcesses < 1) return
      for (let i = 0; i < this.numProcesses; i++) {
        const p = {
          id: i,
          priority: Math.floor((Math.random() * (this.numProcesses - 1)) + 1),
          burstTime: Math.floor((Math.random() * (15 - 1)) + 1),
          timeUsed: 0
        }
        this.processes.push(p)
        this.LRJFProcesses.push({ ...p })
        this.FCFSProcesses.push({ ...p })
        this.RRProcesses.push({ ...p })
        this.PQProcesses.push({ ...p })
      }
    },
    clearProcesses() {
      this.processes = []
      this.LRJFProcesses = []
      this.FCFSProcesses = []
      this.PQProcesses = []
      this.RRProcesses = []
      this.Algorithm = null
      this.numProcesses = 0
      this.quantIn = ''
      this.quant = 0
      this.resultsStore.resetResults()
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#otherData {
  padding-top: 80px;
  padding-bottom: 40px;
}

.alg-card {
  transition: box-shadow 0.2s, transform 0.15s;
}

.alg-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  transform: translateY(-2px);
}

.alg-card-active {
  background-color: #f0faf5;
}

.table {
  margin: auto;
  width: 75% !important;
}

.dropdown-item.active,
.dropdown-item:active {
  color: #42B983;
  font-weight: bold;
  background-color: transparent;
}

.progress-bar {
  background-color: #42B983;
}

.animated {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

@media (print), (prefers-reduced-motion: reduce) {
  .animated {
    -webkit-animation-duration: 1ms !important;
    animation-duration: 1ms !important;
    -webkit-transition-duration: 1ms !important;
    transition-duration: 1ms !important;
    -webkit-animation-iteration-count: 1 !important;
    animation-iteration-count: 1 !important;
  }
}

.animated.infinite {
  -webkit-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fadeIn {
  -webkit-animation-name: fadeIn;
  animation-name: fadeIn;
}

@keyframes pulse {
  from { transform: scale3d(1, 1, 1); }
  50% { transform: scale3d(1.05, 1.05, 1.05); }
  to { transform: scale3d(1, 1, 1); }
}

.pulse {
  -webkit-animation-name: pulse;
  animation-name: pulse;
}

.animated.delay-2s {
  -webkit-animation-delay: 2s;
  animation-delay: 2s;
}

.animated.delay-4s {
  -webkit-animation-delay: 4s;
  animation-delay: 4s;
}
</style>
