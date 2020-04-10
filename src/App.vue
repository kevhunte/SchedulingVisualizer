<template>
<div id="app">
  <div id="navContainer">
    <b-navbar type="dark" variant="dark" class="fixed-top">
      <b-navbar-brand>Scheduling Visualizer</b-navbar-brand>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item-dropdown text="Algorithm" :disabled="this.processes.length <= 0">
            <b-dropdown-item @click="setAlg('FCFS')" :active="this.Algorithm == 'FCFS'">FCFS</b-dropdown-item>
            <b-dropdown-item @click="setAlg('LRJF')" :active="this.Algorithm == 'LRJF'">LRJF</b-dropdown-item>
            <b-dropdown-item @click="setAlg('RR')" :active="this.Algorithm == 'RR'">Round Robin</b-dropdown-item>
            <b-dropdown-item @click="setAlg('PQ')" :active="this.Algorithm == 'PQ'">Priority Queue</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

      </b-collapse>
    </b-navbar>
  </div>
  <div id="otherData" class="col-lg-7 mx-auto">

    <div id="processesContainer">
      <h5>Select a number of processes to simulate:</h5>
      <b-form-input v-model="numProcesses" type="range" min="1" max="50" class="pl-4 pr-4"></b-form-input>
      <div v-if="numProcesses > 0">
        <h6>{{this.numProcesses}}</h6>
        <b-button pill v-if="this.processes.length == 0" @click="generateProcesses()" variant="success">Generate Processes</b-button>
        <b-button pill v-else-if="this.processes.length > 0" @click="clearProcesses()" variant="danger">Reset</b-button>
        <h6 v-if="this.processes.length > 0" class="pt-3"> Number of Processes: {{this.processes.length}}</h6>

        <h6 v-if="this.quant > 0" class="pt-3"> Time quantum is set to: {{this.quant}}s</h6>

        <h6 id="algPicker" v-if="!this.Algorithm && this.processes.length > 0" class="pt-2 animated infinite pulse" style="color: #42B983;">
          Now select a scheduling algorithm from the header tab above
        </h6>
        <div v-if="this.Algorithm=='RR' && this.quant <= 0" class="p-3 animated fadeIn">
          <h6>
            Select a time quantum value below. This determines how long a process will execute for.
          </h6>
          <b-input-group size="md">
            <b-form-input v-model="quantIn" type="number" min="1" max="15" placeholder="Select a number between 1 and 15:"></b-form-input>
            <b-input-group-append>
              <b-button @click="setQuant" @keyup.enter="setQuant" variant="info">Accept</b-button>
            </b-input-group-append>
          </b-input-group>
        </div>
      </div>
    </div>

    <div id="AlgContainer" class="p-3">
      <FCFS id="FCFS" v-if="this.Algorithm=='FCFS'" class="animated fadeIn" :proc="this.FCFSProcesses" :quantum="5" />
      <LRJF id="LRJF" v-if="this.Algorithm=='LRJF'" class="animated fadeIn" :proc="this.LRJFProcesses" :quantum="5" />
      <RR id="RR" v-if="this.Algorithm=='RR' && this.quant > 0" class="animated fadeIn" :proc="this.RRProcesses" :quantum="this.quant" />
      <PQ id="PQ" v-if="this.Algorithm=='PQ'" class="animated fadeIn" :proc="this.PQProcesses" :quantum="5" />
    </div>
    <div id="ComparisonContainer" v-if="this.$store.getters.results.length" class="pb-5">
      <h6>
        Results:
      </h6>
      <b-table striped hover :fields="fields" :items="this.$store.getters.results || null" class="table-responsive">
      </b-table>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'App',
  components: {
    FCFS: () => import('./components/FCFS.vue'),
    LRJF: () => import('./components/LRJF.vue'),
    RR: () => import('./components/RoundRobin.vue'),
    PQ: () => import('./components/PriorityQueue.vue')
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
      fields: ['Algorithm', 'throughput', 'utilization', 'avgWaitTime', 'turnaround']
    }
  },
  watch: {
    'Algorithm': function(val) {
      if (val) {
        if (!val.includes('RR')) { // clear element when not Round Robin
          this.quantIn = '';
          this.quant = 0;
        }
      }
    }
  },
  methods: {
    setQuant() {
      let val = parseInt(this.quantIn.replace(/[^0-9]+/g, ""));
      if (typeof val == 'number') {
        val = val > 15 ? 15 : val;
        val = val < 1 ? 1 : val;
        this.quant = val;
      }
    },
    setAlg(alg) {
      this.Algorithm = alg;
      // do more stuff here
    },
    generateProcesses() {
      if (this.numProcesses < 1) {
        return;
      }
      for (let i = 0; i < this.numProcesses; i++) {
        let p = {
          "id": i,
          "priority": Math.floor((Math.random() * (this.numProcesses - 1)) + 1),
          "burstTime": Math.floor((Math.random() * (15 - 1)) + 1),
          "timeUsed": 0
        }

        let p2 = {
          ...p
        }

        let p3 = {
          ...p
        }

        let p4 = {
          ...p
        }
        let p5 = {
          ...p
        }

        this.processes.push(p);
        this.LRJFProcesses.push(p5);
        this.FCFSProcesses.push(p2);
        this.RRProcesses.push(p3);
        this.PQProcesses.push(p4);
      }
    },
    clearProcesses() {
      this.processes = [];
      this.LRJFProcesses = [];
      this.FCFSProcesses = [];
      this.PQProcesses = [];
      this.RRProcesses = [];
      this.Algorithm = null;
      this.numProcesses = 0;
      this.quantIn = '';
      this.quant = 0;
      this.$store.dispatch('resetResults');
    }
  }
}
</script>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

#otherData {
    padding-top: 80px;
}

#algPicker {
    -webkit-animation-duration: 2s;
    animation-duration: 2s;
}

//@media (min-width: 768px) {
.table {
    margin: auto;
    width: 75% !important;
}
//}

.dropdown-item.active,
.dropdown-item:active {
    color: #42B983;
    font-weight: bold;
    background-color: transparent;
}

.dropdown-toggle:after {
    content: none;
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

.animated.delay-1s {
    -webkit-animation-delay: 1s;
    animation-delay: 1s;
}

.animated.delay-2s {
    -webkit-animation-delay: 2s;
    animation-delay: 2s;
}

.animated.delay-3s {
    -webkit-animation-delay: 3s;
    animation-delay: 3s;
}

.animated.delay-4s {
    -webkit-animation-delay: 4s;
    animation-delay: 4s;
}

@-webkit-keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.fadeIn {
    -webkit-animation-name: fadeIn;
    animation-name: fadeIn;
}

@-webkit-keyframes pulse {
    from {
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1);
    }

    50% {
        -webkit-transform: scale3d(1.05, 1.05, 1.05);
        transform: scale3d(1.05, 1.05, 1.05);
    }

    to {
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1);
    }
}

@keyframes pulse {
    from {
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1);
    }

    50% {
        -webkit-transform: scale3d(1.05, 1.05, 1.05);
        transform: scale3d(1.05, 1.05, 1.05);
    }

    to {
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1);
    }
}

.pulse {
    -webkit-animation-name: pulse;
    animation-name: pulse;
}
</style>
