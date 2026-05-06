import { defineStore } from 'pinia'

export const useResultsStore = defineStore('results', {
  state: () => ({
    results: []
  }),
  actions: {
    passResults(payload) {
      for (const r of this.results) {
        if (r.Algorithm === payload.Algorithm) return
      }
      if (this.results.length < 4) {
        this.results.push(payload)
        this.results.sort((a, b) => a.id > b.id ? 1 : -1)
      }
    },
    resetResults() {
      this.results = []
    }
  }
})
