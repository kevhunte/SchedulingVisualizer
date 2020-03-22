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
            <b-dropdown-item href="#">FCFS</b-dropdown-item>
            <b-dropdown-item href="#">LRJF</b-dropdown-item>
            <b-dropdown-item href="#">Round Robin</b-dropdown-item>
            <b-dropdown-item href="#">Priority Queue</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

      </b-collapse>
    </b-navbar>
  </div>
  <div id="otherData" class="">
    <h4>
      Scheduling Visualizer
    </h4>
    ------ Input for # of processes. Tell users to select alg from nav. Make active alg a different color ------- <br>
    Display number of processes and Algorithm here <br>
    ----- Scheduling Components in v-if to render with choice -----
  </div>
</div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    //HelloWorld
  },
  data() {
    return {

    }
  },
  methods: {

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

.dropdown-toggle:after {
    content: none;
}
</style>
