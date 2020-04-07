import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    results: [],
  },
  mutations: {
    storeResults(state, val){
      //state.results = value;
      // dynamically grow array
      console.log('received:', val);
      if(!state.results){ // always grow if empty
        state.results.push(val.payload);
        state.results.sort((a,b) => a.id > b.id ? 1 : -1);
      }
      else{ // check if less than 4. If not, all simulations have been run already
        if(state.results.length < 4){
          state.results.push(val.payload);
          state.results.sort((a,b) => a.id > b.id ? 1 : -1);
        }
      }

    },
    clearResults(state){
      console.log('resetting');
      state.results = [];
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
