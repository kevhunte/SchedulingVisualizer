import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    results: [],
  },
  mutations: {
    storeResults(state, val){
      if(!state.results){
        state.results.push(val.payload);
        state.results.sort((a,b) => a.id > b.id ? 1 : -1);
      }
      else{
        if(state.results.length < 4){
          state.results.push(val.payload);
          state.results.sort((a,b) => a.id > b.id ? 1 : -1);
        }
      }

    },
    clearResults(state){
      state.results = [];
    }
  },
  actions: {
    passResults(context,results){
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
