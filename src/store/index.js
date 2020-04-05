import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    results: [null, null, null, null],
  },
  mutations: {
    storeResults(state, val){
      //state.results = value;
      console.log('received:', val);
      if (val.alg == 'FCFS') {
        state.results[0] = val.payload;
      } else if (val.alg == 'LRJF') {
        state.results[1] = val.payload;
      } else if (val.alg == 'RR') {
        state.results[2] = val.payload;
      } else if (val.alg == 'PQ') {
        state.results[3] = val.payload;
      }
    },
    clearResults(state){
      console.log('resetting');
      state.results = [null, null, null, null];
    }
  },
  actions: {
    passResults(context,results){
      //console.log('reached here',results);
      context.commit('storeResults',results);
    },
    resetResults(context){
      context.commit('clearResults');
    }
  },
  getters: {
    results: state => state.results,
  }
})
