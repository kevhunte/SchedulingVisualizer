<template>
<div id="app">
  <!--<img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>-->
  <div id="navContainer">
    <b-navbar type="dark" variant="dark" class="fixed-top">
      <b-navbar-brand href="#">Scheduling Visualizer</b-navbar-brand>

      <!--<b-navbar-toggle target="nav-collapse"></b-navbar-toggle>-->

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item-dropdown text="Algorithm">
            <b-dropdown-item @click="setAlg('FCFS')" href="#" :active="this.Algorithm == 'FCFS'">FCFS</b-dropdown-item>
            <b-dropdown-item @click="setAlg('LRJF')" href="#" :active="this.Algorithm == 'LRJF'">LRJF</b-dropdown-item>
            <b-dropdown-item @click="setAlg('RR')" href="#" :active="this.Algorithm == 'RR'">Round Robin</b-dropdown-item>
            <b-dropdown-item @click="setAlg('PQ')" href="#" :active="this.Algorithm == 'PQ'">Priority Queue</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

      </b-collapse>
    </b-navbar>
  </div>
  <div id="otherData" class="col-md-7 mx-auto">
    <!--<h4>
      Scheduling Visualizer
    </h4>-->

    <div id="processesContainer">
      <h5>Select a number of processes to simulate:</h5>
      <b-form-input v-model="numProcesses" type="range" min="1" max="50"></b-form-input>
      <div v-if="numProcesses > 0">
        <h6>{{this.numProcesses}}</h6>
        <b-button pill @click="generateProcesses()" variant="success">Generate</b-button>
        <b-button pill v-if="this.processes.length > 0" @click="clearProcesses()" variant="danger">Clear</b-button>
        <h6 v-if="this.processes.length > 0" class="pt-3"> Number of Processes: {{this.processes.length}}</h6>
        <h6 id="algPicker" v-if="!this.Algorithm && this.processes.length > 0" class="pt-2 animated infinite pulse" style="color: #42B983;">
          Now select a scheduling algorithm from the navigation bar above
        </h6>
      </div>
    </div>

    <div id="AlgContainer" class="pt-3">
      <FCFS v-if="this.Algorithm=='FCFS'" class="animated fadeIn" :proc="this.processes" />
      <LRJF v-if="this.Algorithm=='LRJF'" class="animated fadeIn" />
      <RR v-if="this.Algorithm=='RR'" class="animated fadeIn" />
      <PQ v-if="this.Algorithm=='PQ'" class="animated fadeIn" />
    </div>
  </div>
</div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
import FCFS from './components/FCFS.vue'
import LRJF from './components/LRJF.vue'
import PQ from './components/PriorityQueue.vue'
import RR from './components/RoundRobin.vue'

export default {
  name: 'App',
  components: {
    //HelloWorld
    FCFS,
    LRJF,
    RR,
    PQ
  },
  data() {
    return {
      Algorithm: null,
      processes: [],
      numProcesses: 0
    }
  },
  methods: {
    setAlg(alg) {
      this.Algorithm = alg;
      // do more stuff here
    },
    generateProcesses() {
      if (this.numProcesses < 1) {
        return;
      }
      console.log('generating...')
      for (let i = 0; i < this.numProcesses; i++) {
        // priority from 1 to numProcesses
        let p = {
          "id": i,
          "priority": Math.floor((Math.random() * (this.numProcesses - 1)) + 1),
          "burstTime": Math.floor((Math.random() * 14) + 1)
        }
        this.processes.push(p);
      }
      console.log(this.processes);
    },
    clearProcesses() {
      console.log('clearing...');
      this.processes = []; // allocates new array. Won't break ref for components
      this.Algorithm = null;
      this.numProcesses = 0;
      //console.log(this.processes);
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
    animation-duration: 2s;
}

.dropdown-item.active,
.dropdown-item:active {
    // navbar header elements
    color: #42B983;
    font-weight: bold;
    background-color: transparent;
}

.dropdown-toggle:after {
    content: none;
}
</style>
