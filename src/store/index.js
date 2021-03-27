import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    exercises: {}
  },

  getters: {  
  },

  mutations: {
    ADD_EXERCISE: (state, exercise)=> {

      if(!exercise) return console.error('no exercise')

      // If the exercise doesn't exist yet, add it
      if (!(exercise.name in state.exercises)) {
        state.exercises[exercise.name] = []
      } 

      // Push the exercise to the array
      state.exercises[exercise.name].push(exercise)

    },

    DELETE_EXERCISE: (state, exercise) => {
      const type = state.exercises[exercise.name] 
      const date = exercise.date

      if(!exercise) return console.error('No exercise')

      if(!type) return console.error('Exercise type not found')
      
      if( !type.some(el => el.date === date) ) return console.error('Exercise on specified date not found')
      
      // Should probably use IDs or something for this but I'm lazy
      if( type.some(el => el.date === date) ) {
        const exIdx = type.findIndex(el => el.date === date)

        type.splice(exIdx, 1)
      }

    },

    SET_EXERCISE_HISTORY: (state, allExercises)=> {
    
      if (allExercises) {
        for(let property in allExercises) {
          state.exercises[property] = allExercises[property]
        }        
      }

    }
  },

  actions: {
  },
  modules: {
  }
})
